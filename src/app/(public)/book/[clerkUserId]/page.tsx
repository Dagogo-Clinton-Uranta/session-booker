import { notFound } from "next/navigation";
//import {clerkClient} from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/clerk-sdk-node";
import { addMonths, eachMinuteOfInterval, endOfDay, roundToNearestMinutes } from "date-fns";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MeetingForm } from "@/components/forms/MeetingForm";
import { db } from "@/drizzle/db";

export const revalidate = 0 

export default async function BookEventPage ({params: {clerkUserId,eventId}}:{params:{clerkUserId:string;eventId:string}}){
    
const event = await db.query.EventTable.findFirst({
    where:(({clerkUserId:userIdCol,isActive,id},{eq,and})=>and(
        eq(isActive,true),eq(userIdCol,clerkUserId),eq(id,eventId)
    )),
})


//const event = await db.query.EventTable.findFirst({
//  where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
//    and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
//})



 if(event ===null){return notFound()}

 const calendarUser = await clerkClient.users.getUser(clerkUserId)

 const startDate = roundToNearestMinutes(new Date(),{
    nearestTo:15,
    roundingMethod:"ceil"
 })

 const endDate = endOfDay(addMonths(startDate,2))

 const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval({start:startDate,end:endDate},{step:15  })
    ,event) 

    if(validTimes.length === 0 ){
        return <NoTimeSlots event={event}  calendarUser={calendarUser}/>
    }

    return (
        <Card>
        <CardHeader>
          <CardTitle>
            Book {event.name} with {calendarUser.fullName}
          </CardTitle>
          {
            event.description &&
            <CardDescription>
                {event.description}
            </CardDescription>
          }
        </CardHeader>
        <CardContent>
        <MeetingForm
        validTimes={validTimes}
        eventId={event.id}
        clerkUserId={clerkUserId}
        />
        </CardContent>
       
       </Card>  
    )
}


function NoTimeSlots ({event,calendarUser}:{
    event:{name:string; description:string|null}
    calendarUser:{id:string; fullName:string|null}
}){
    return (
           <Card>
            <CardHeader>
              <CardTitle>
                Book {event.name} with {calendarUser.fullName}
              </CardTitle>
              {
                event.description &&
                <CardDescription>
                    {event.description}
                </CardDescription>
              }
            </CardHeader>
            <CardContent>
             {calendarUser.fullName}  is currently booked up. Please check back later, or choose a shorter event.
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/book/${calendarUser.id}`}>
                  Choose Another Event
                </Link>
              </Button>
            </CardFooter>
           </Card>  
      )
}