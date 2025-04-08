import { NavLink } from "@/components/Navlink";
import { UserButton } from "@clerk/nextjs";
import { CalendarRange } from "lucide-react";
import {ReactNode} from "react";


export default function PrivateLayout({children}:{children:ReactNode}){

      return(
        <>
      <header>
        <nav className="font-medium flex items-center text-sm gap-6 container">
          <div className="font-semibold flex items-center gap-2 mr-auto"></div>
          <CalendarRange className="size-6"/>
          <span className="sr-only md:not-sr-only">Session Booker</span>
         
         <NavLink href="/events">Events</NavLink>
         <NavLink href="/schedule" >Schedule</NavLink>

          <div className="ml-auto size-10">
         { <UserButton appearance={{  
            elements: {userButtonAvatarBox:"size-full"}
           }}/> }

          </div>
        </nav>

      </header>
      <main className="container my-6 mx-auto">
        {children}
      </main>
      </>
      )
}