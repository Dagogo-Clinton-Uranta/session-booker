

import {clerkMiddleware,createRouteMatcher} from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher(["/","sign-in(.*)","sign-up(.*)","/book(.*)","/api(.*)"])


export default  clerkMiddleware(async(auth,req)=>{
    if (!isPublicRoute(req)) {

       // await auth.protect()
        const { userId,redirectToSignIn } = await auth();
        const authCheck =  await auth();
        console.log("MIDDLEWARE, AUTH CHECK IS-->",authCheck)
        /// userId is in auth(), but userId continues to be undefined - clerk why  april 7 -1:00am?
        if (!userId) {
          // User is not signed in → redirect
          console.log("MIDDLEWARE, AUTH CHECK IS-->",authCheck)
         // return redirectToSignIn({ returnBackUrl: req.url });
        }
      }
})


export const config = {
    matcher:[
       //skip next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
       //always run for all API routes
        "/(api|trpc)(.*) ",
    ]
}