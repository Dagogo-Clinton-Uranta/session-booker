"use client"

import {useForm} from "react-hook-form"
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { eventFormSchema } from "@/schema/events"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import Link from "next/link"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Switch } from "@radix-ui/react-switch"

import {createEvent,updateEvent} from "@/server/actions/events"

import { useState, useTransition } from "react"
import {  AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTrigger,AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { deleteEvent } from "@/server/actions/events"

export function EventForm ({event}:{event?:
    {
        id:string  //no semi colon ?
      name:string
      durationInMinutes:number
      isActive:boolean
      description?:string
    }}){


        const [isDeletePending,startDeleteTransition] = useTransition()

  
    const form = useForm<z.infer<typeof eventFormSchema>> ({
        resolver:zodResolver(eventFormSchema),
        defaultValues:{
            isActive:true,
            durationInMinutes:30
        }
    })
    

   async function onSubmit(values:z.infer<typeof eventFormSchema>){
   const action = event === null? createEvent:updateEvent.bind(null,event.id)
        console.log(values)
      const data = await action(values)
      if(data?.error){
        form.setError("root",{
            message:"There was an error saving your event"
        })
      }
    }
    return <Form {...form}>
    
     <form onSubmit={form.handleSubmit(onSubmit)}
     className="flex gap-6 flex-col">

        {form.formState.errors.root && (
        <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
        </div>
        )}


        {/*1*/}
        <FormField
         control={form.control}
         name="name"
         render={({field})=>(
            <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                    <Input {...field}/>
                </FormControl>

                <FormDescription>
                    The name users will see when booking
                </FormDescription>
                
                <FormMessage/>

            </FormItem>
         )}
         />


    {/**2 */}
   <FormField
         control={form.control}
         name="durationInMinutes"  //the name must be one of the ones in the schema
         render={({field})=>(
            <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                    <Input type="number" {...field}/>
                </FormControl>

                <FormDescription>
                    In minutes
                </FormDescription>
                
                <FormMessage/>

            </FormItem>
         )}
         />


  {/*3 */}
    <FormField
         control={form.control}
         name="description"
         render={({field})=>(
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea className="resize none h-32" {...field}/>
                </FormControl>

                <FormDescription>
                    Optional description of the event
                </FormDescription>
                
                <FormMessage/>

            </FormItem>
         )}
         />

{/** 4*/}
<FormField
         control={form.control}
         name="isActive"
         render={({field})=>(
            <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                      <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </div>
                <FormDescription>
                    Inactive Events will not be visible for users to book
                </FormDescription>
                
                <FormMessage/>

            </FormItem>
         )}
         />





            <div className="flex gap-2 justify-end">

            {event && (

               <AlertDialog>
                 <AlertDialogTrigger asChild>
                   
                   <Button variant="destructiveGhost" disabled={isDeletePending || form.formState.isSubmitting}>
                     Delete  
                   </Button>
                 </AlertDialogTrigger>

                 <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>  Are you sure? </AlertDialogTitle>

                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your event. 
                           </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                          variant="destructive" //if you want to delete, check 1:31 of kyle video, to kenow what to delete, but I think I got it right
                           disabled={isDeletePending || form.formState.isSubmitting}
                           onClick= {()=>{startDeleteTransition(async()=>{
                          const data =   await deleteEvent(event.id)

                            if(data?.error){
                             form.setError("root",{
                                message:"There was an error deleting your event",

                             })
                            }
                           })
                        }}
                          >
                            Delete 
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      
                      
                    </AlertDialogContent>
               </AlertDialog>

            )}


             <Button disabled={isDeletePending || form.formState.isSubmitting} 
             type="button" asChild variant="outline">
              <Link href="/events"> Cancel</Link>
             </Button>

             <Button disabled={isDeletePending || form.formState.isSubmitting}
             type="submit" >
               Save
             </Button>
            </div>


     </form>

    </Form>
}