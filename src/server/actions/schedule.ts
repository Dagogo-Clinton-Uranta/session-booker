"use server"

import { db } from "@/drizzle/db"
import { EventTable, ScheduleTable, scheduleAvailabilityTable } from "@/drizzle/schema"
import { scheduleFormSchema } from "@/schema/schedule"
import { and, eq } from "drizzle-orm"
import {auth} from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import "server-only" //this library is just to throw an error if this code ever gets run anywhere not on a server"
import {z} from 'zod'
import { BatchItem } from "drizzle-orm/batch"
//import { scheduleFormSchema } from "@/schema/events"

export async function saveSchedule (unsafeData: z.infer<typeof scheduleFormSchema>){
  const {userId} =await auth()
  const {success,data} = scheduleFormSchema.safeParse(unsafeData)

  if(!success || userId === null){
    return {error:true}
  }

  const {availabilities,...scheduleData} = data

  const [{id: scheduleId}] = await db.insert(ScheduleTable)
  .values({...scheduleData,clerkUserId:userId})
  .onConflictDoUpdate({
    target:ScheduleTable.clerkUserId,
    set:scheduleData,
  })
   .returning({id:ScheduleTable.id})

   const statements: [BatchItem<"pg">] = [
    db.delete(scheduleAvailabilityTable)
    .where(eq(scheduleAvailabilityTable.scheduleId,scheduleId))
   ]

    if(availabilities){
        statements.push(
            db.insert(scheduleAvailabilityTable).values(
                availabilities.map((availability)=>(
                 {
                    ...availability,
                    scheduleId
                 }
                ))
            )
        )
    
    
    
    }


   await db.batch(statements)
}