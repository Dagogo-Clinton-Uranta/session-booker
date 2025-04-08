"use client"

import { CopyCheck,Copy,CopyX } from "lucide-react";
import { Button,ButtonProps } from "./ui/button";
import { useState } from "react";

export function CopyEventButton({
    eventId,
    clerkUserId,
     ...buttonProps
    }:Omit<ButtonProps,"children"> & {eventId: string; clerkUserId:string}){

const [copyState,setCopyState] = useState<CopyState>("idle")

 type CopyState = "idle"|"copied"|"error"
const CopyIcon = getCopyIcon(copyState)

 
 return <Button {...buttonProps}
    onClick={()=>{
        navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}`)
        .then(()=>{
            setCopyState("copied")
            setTimeout(()=>{ setCopyState("idle")},2000)
        })
        .catch(()=>{
           setCopyState("error")
            setTimeout(()=>{ setCopyState("idle")},2000)
        })
    }

    }
 >
        <CopyIcon className="size-4 mr-2" />
        {getChildren(copyState)}
       </Button>


function getCopyIcon(copyState: CopyState){
   switch(copyState){
    case"idle":
    return Copy
    case"copied":
    return CopyCheck
    case"error":
    return CopyX


   }

}


function getChildren(copyState: CopyState){
   switch(copyState){
    case"idle":
    return "Copy Link"
    case"copied":
    return "Copied!"
    case"error":
    return "Error"


   }

}
 }