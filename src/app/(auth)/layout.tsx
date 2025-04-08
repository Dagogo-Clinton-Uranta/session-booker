"use client"
import {auth} from '@clerk/nextjs/server';
import { useAuth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import {ReactNode} from 'react';


export default function AuthLayout({children}:{children:ReactNode}){
  //notice how we do styles when we are destructuring properties, even the type seems to be destructured too

 const { userId } = useAuth()
 if (userId !== null){ redirect("/")}


  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
        {children}
    </div>
  )
  

}