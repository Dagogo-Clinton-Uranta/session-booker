"use server"

import { db } from "@/drizzle/db"
import { EventTable } from "@/drizzle/schema"
import { eventFormSchema } from "@/schema/events"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import {auth} from "@clerk/nextjs/server"

import "server-only" //this library is just to throw an error if this code ever gets run anywhere not on a server"
import {z} from 'zod'

export async function createEvent (unsafeData: z.infer<typeof eventFormSchema>):Promise<{error:boolean}|undefined>{
    const {userId} = await auth()
    unsafeData.name =""

    const {success,data} = eventFormSchema.safeParse(unsafeData)

   if(!success){
     return {error:true}
   }

   db.insert(EventTable).values({...data,userId:userId, clerkUserId:userId})

  redirect("/events")
}



export async function updateEvent (id:string,unsafeData: z.infer<typeof eventFormSchema>):Promise<{error:boolean}|undefined>{
  const {userId} =await auth()
  unsafeData.name =""

  const {success,data} = eventFormSchema.safeParse(unsafeData)

 if(!success||userId === null){
   return {error:true}
 }

 const {rowCount} = await 
          db.update(EventTable)
          .set({...data})
         .where(and((eq(EventTable.id,id),eq(EventTable.clerkUserId,userId))  ))

 //db.insert(EventTable).values({...data,userId:userId, clerkUserId:userId})

 if (rowCount === 0) {
   return {error:true}
 }

redirect("/events")
}


export async function deleteEvent (id:string):Promise<{error:boolean}|undefined>{
  const {userId} = await auth()
 

 // const {success,data} = eventFormSchema.safeParse(unsafeData)

 if(userId === null){
   return {error:true}
 }

 const {rowCount} = await db.delete(EventTable)
          
         .where(and((eq(EventTable.id,id),eq(EventTable.clerkUserId,userId))  ))

 //db.insert(EventTable).values({...data,userId:userId, clerkUserId:userId})

 if (rowCount === 0) { //how does this code here make sure an actual delete happened, I mean it doesn make sense 
   return {error:true}
 }

redirect("/events")
}