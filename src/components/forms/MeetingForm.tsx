"use client"

import {useForm} from "react-hook-form"
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { meetingFormSchema } from "@/schema/meetings"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import Link from "next/link"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Switch } from "@radix-ui/react-switch"

import {createEvent,updateEvent} from "@/server/actions/events"

import { useMemo, useState, useTransition } from "react"

import { deleteEvent } from "@/server/actions/events"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { formatTimezoneOffset } from "@/lib/formatters"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"

import { Calendar } from "../ui/calendar"
import { toZonedTime } from "date-fns-tz"
import { CalendarIcon } from "lucide-react"

import { formatDate,formatTimeString } from "@/lib/formatters"
import { isSameDay } from "date-fns"
import { createMeeting } from "@/server/actions/meetings"

export function MeetingForm ({validTimes,eventId,clerkUserId}:
    {
      validTimes:Date[],
      clerkUserId:string,
      eventId:string
    }){


        const [isDeletePending,startDeleteTransition] = useTransition()

  
    const form = useForm<z.infer<typeof meetingFormSchema>> ({
        resolver:zodResolver(meetingFormSchema),
        defaultValues:{
           timezone:Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    })


    const timezone = form.watch("timezone")
    const date = form.watch("date")

    const validTimesInTimezone = useMemo(()=>{
    return validTimes.map((date)=>(toZonedTime(date,timezone))  )
    },[validTimes,timezone])
    

   async function onSubmit(values:z.infer<typeof meetingFormSchema>){
   const action = event === null? createEvent:updateEvent.bind(null,event.id)
        console.log(values)
      const data = await createMeeting({...values, eventId,clerkUserId})
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
         name="timezone"
         render={({field})=>(
            <FormItem>
                <FormLabel>Timezone</FormLabel>
               
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>

                    </SelectValue>
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((timezone)=>(
                     <SelectItem key={timezone} value={timezone}>
                      {timezone}
                      {` (${formatTimezoneOffset(timezone)})`  }
                     </SelectItem>
                  ))}
                </SelectContent>
                </Select>

                <FormDescription>
                    The name users will see when booking
                </FormDescription>
                
                <FormMessage/>

            </FormItem>
         )}
         />


                 <div className="flex-gap-4 flex-col md:flex-row">
                  <FormField
                   control={form.control}
                   name="date"
                   render={({field}) =>(
                    <Popover>
                      <FormItem className="flex-1">
                        <FormLabel>Date</FormLabel>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                             variant="outline"
                             className={cn("pl-3 text-left font-normal flex-full",!field.value &&"text-muted-foreground")}
                            >
                            {field.value?(
                               <span>
                              formatDate(field.value)
                              </span>
                            ):
                            (
                              <span>
                                Pick a Date
                              </span>
                            )
                            }
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="a-wuto p-0" align="start">
                         <Calendar
                         mode="single"
                         selected={field.value}
                         onSelect={field.onChange}
                         disabled={(date)=>{
                          !validTimesInTimezone.some((time)=>{isSameDay(date,time)})
                         }
                         }
                         initialFocus
                         />

                         
                        </PopoverContent>
                        <FormMessage/>
                      </FormItem>
                    </Popover>
                   )

                   }
                  />


                  <FormField
                   control={form.control}
                   name="startTime"
                   render={({field}) =>(
                   
                      <FormItem className="flex-1">
                        <FormLabel>Time</FormLabel>
                        <Select disabled={date == null || timezone == null}
                        onValueChange={(value) => (field.onChange(new Date(Date.parse(value)) ))}
                        defaultValue={field.value?.toISOString()}
                        >

                          <FormControl>
                           <SelectTrigger>
                            <SelectValue
                              placeholder={
                                date == null || timezone == null
                                ? "Select a date/timezone first":
                                  "Select a meeting time"

                              }
                            />
                           </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {validTimesInTimezone.filter((time)=>(
                             
                              isSameDay(time,date)
                             
                              )).map((time)=>(
                                <SelectItem key={time.toISOString()} value={time.toISOString()}>
                                  {formatTimeString(time)}
                                </SelectItem>
                              ))
                              
                              
                              }
                          </SelectContent>

                        </Select>
                       
                        
                        <FormMessage/>
                      </FormItem>
                    
                   )

                   }
                  />
                 </div>


               <div className="flex gap-4">
               <FormField
                   control={form.control}
                   name="guestName"
                   render={({field}) =>(
                   
                      <FormItem className="flex-1">
                        <FormLabel>Your Name</FormLabel>
                      

                          <FormControl>
                           <Input {...field}/>
                          </FormControl>
                       
                       
                        
                        <FormMessage/>
                      </FormItem>
                    
                   )

                   }
                  />



                <FormField
                   control={form.control}
                   name="guestEmail"
                   render={({field}) =>(
                   
                      <FormItem className="flex-1">
                        <FormLabel>Your Email</FormLabel>
                      

                          <FormControl>
                           <Input type="email" {...field}/>
                          </FormControl>
                       
                       
                        
                        <FormMessage/>
                      </FormItem>
                    
                   )

                   }
                  />
               </div>





            <div className="flex gap-2 justify-end">



             <Button disabled={form.formState.isSubmitting} 
             type="button" asChild variant="outline">
              <Link href={`book/${clerkUserId}`}> Cancel</Link>
             </Button>

             <Button disabled={form.formState.isSubmitting}
             type="submit" >
               Save
             </Button>
            </div>


     </form>

    </Form>
}