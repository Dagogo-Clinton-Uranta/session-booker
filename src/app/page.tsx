//"use client"; // Required if using Next.js 13+ App Router
import { Button } from "@/components/ui/button";
import { SignIn, SignInButton, SignUp, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
//import { useRouter } from "next/router";
//import { useEffect } from "react";

export default async function HomePage() {
  //const router = useRouter();
//
//  const handleNavigation = (route:string):void => {
//    router.push(route); // Navigate to the About page
//  };

const {userId} = await auth()
  //const {userId} = useAuth()
  console.log("USER ID IS-->",userId)
 //if (userId !== null||userId !== undefined ){ redirect("/events")} 

  //useEffect(() => {
  //  if (userId) {
  //    router.push("/book");
  //  }
  //}, [userId, router]);
//
 
 
 //kyle used to redirect to /events,so that everyone can create an event, but only the eco it guy should be able to create events
 //so i should look for a particular login and only that login (eco it guy) can create events, is events page only for 
 //creating? or is it for viewing - apr 6  -dagogo
 //if it is for only creating then students need not see it
 //it is for creating and viewing then only the create button should be blocked out for users




// GET THE USERID FROM FIREBASE INSTEAD OF THEIR CLERK - maybe- MAR 23 DAGOGO

  return (
    <div className="text-center container my-4 mx-auto">
      <h1>Welcome to ECO IT Session Booking Platform</h1>

      <div className="flex gap-2 justify-center">
        {/**I SKIPPED THE CLERK SECTION-- I WILL USE FIREBASE AUTHENTICAITON */}

        <Button asChild>
          <span>
          <SignInButton/>
          </span>
        </Button>

         <Button asChild>
          <span>
           <SignUpButton/>
           </span>
           </Button>

          <span>
           <UserButton/>
          </span>

       {/* <Button onClick={()=>{handleNavigation('/book')} }  >Sign In</Button>
        <Button onClick={()=>{handleNavigation('/book')} }>Sign Up</Button>*/}
      </div>

    </div>
  );
}
