"use client"

import {useForm,useFieldArray} from "react-hook-form"
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { scheduleFormSchema } from "@/schema/schedule"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import Link from "next/link"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Switch } from "@radix-ui/react-switch"

import {createEvent,updateEvent} from "@/server/actions/events"
import { saveSchedule } from "@/server/actions/schedule"

import { Fragment, useState, useTransition } from "react"
import {  AlertDialog,
          AlertDialogContent,
    AlertDialogDescription,
     AlertDialogTrigger,
     AlertDialogHeader,
      AlertDialogTitle,
       AlertDialogFooter,
        AlertDialogCancel,
         AlertDialogAction } from "../ui/alert-dialog"
import { deleteEvent } from "@/server/actions/events"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { timeToInt } from "@/lib/utils"
import { Select,SelectTrigger,SelectValue } from "../ui/select"
import { SelectContent, SelectItem } from "@radix-ui/react-select"
import {formatTimezoneOffset} from "@/lib/formatters"

import {Plus,X} from "lucide-react"



type Availability = {
  startTime: string
  endTime:string
  dayOfWeek:(typeof DAYS_OF_WEEK_IN_ORDER)[number]

}

export function ScheduleForm ({schedule}:{schedule?:
    {
       
        timezone:string
        availabilities:Availability[]
    
    }}){


        const [isDeletePending,startDeleteTransition] = useTransition()
       const [successMessage,setSuccessMessage]= useState<string>()
  
    const form = useForm<z.infer<typeof scheduleFormSchema>> ({
        resolver:zodResolver(scheduleFormSchema),
        defaultValues:{
           // isActive:true,
           // durationInMinutes:30
           timezone:schedule?.timezone??Intl.DateTimeFormat().resolvedOptions().timeZone,
           availabilities:schedule?.availabilities.toSorted((a,b)=>{
            return timeToInt(a.startTime) - timeToInt(b.startTime)
           }),
        }
    })
    

   const {
    append:addAvailability,
    remove:removeAvailability,
    fields:availabilityFields,
   } = useFieldArray({name:"availabilities",control:form.control})


    const groupedAvailabilityFields = Object.groupBy(
      availabilityFields.map((field,index)=>({...field,index})),
      availability => (availability.dayOfWeek)
    )

   async function onSubmit(values:z.infer<typeof scheduleFormSchema>){
   
        console.log(values)
      const data = await saveSchedule(values)
      if(data?.error){ 
        form.setError("root",{
            message:"There was an error saving your schedule"
        })
      }else{
        setSuccessMessage("Schedule saved!")
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


{successMessage && (
        <div className="text-green-500 text-sm">
            {successMessage}
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

     
        <div className=" grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek)=>(
           
           <Fragment key={dayOfWeek}>
             <div className="capitalize text-sm font-semibold">
              {dayOfWeek.substring(0,3)}
              </div>

              <div className="flex flex-col gap-2">
               <Button type="button" variant="outline" className="size-6 p-1" onClick={()=>{
                addAvailability({
                  dayOfWeek,
                  startTime:"9:00",
                  endTime:"17:00"
                })
               }}>
                 <Plus className="size-full"/>
               </Button>

          {groupedAvailabilityFields[dayOfWeek]?.map((field:any,labelIndex)=>(


           <div className="flex flex-col gap-1" key={field.id} >
         


            <div className="flex gap-2 items-center">      
                {/*1*/}
                <FormField
                control={form.control}
                name={`availabilities.${field.index}.startTime`}
                render={({field})=>(
                   <FormItem>
                     <FormControl>
                       <Input className="w-24"
                       aria-label={`${dayOfWeek} Start Time ${labelIndex + 1}`}
                        {...field}/>
                        </FormControl>
     
                    
                    
                   </FormItem>
     
     
     
     
                )}
                />
     
                -
                 {/*2*/}
                 <FormField
                 control={form.control}
                 name={`availabilities.${field.index}.endTime`}
                 render={({field})=>(
                    <FormItem>
                      <FormControl>
                        <Input className="w-24"
                        aria-label={`${dayOfWeek} End Time ${labelIndex + 1}`}
                         {...field}/>
                         </FormControl>
      
                      <FormMessage/>
                     
                    </FormItem>
  
                 )}
                 />

                 <Button type="button" className="size-6 p-1" variant="destructiveGhost"
                 onClick={()=>{removeAvailability(field.index)}}>
                   <X/>
                 </Button>
           </div>

                <FormMessage>
                      {form.formState.errors.availabilities?.
                      at?.(
                        field.index,

                      )?.root?.message
                    }
                     </FormMessage>

                     <FormMessage>
                      {form.formState.errors.availabilities?.
                      at?.(
                        field.index,

                      )?.startTime?.message
                    }
                     </FormMessage>


                     <FormMessage>
                      {form.formState.errors.availabilities?.
                      at?.(
                        field.index,

                      )?.endTime?.message
                    }
                     </FormMessage>


        </div>    
               ))}
              </div>
           </Fragment>
          ))}
        </div>




            <div className="flex gap-2 justify-end">




            {/* <Button   disabled={isDeletePending || form.formState.isSubmitting} type="button" asChild variant="outline">
              <Link href="/events"> Cancel</Link>
        </Button>*/}

             <Button  disabled={form.formState.isSubmitting} type="submit" >
               Save
             </Button>
            </div>


     </form>

    </Form>
}