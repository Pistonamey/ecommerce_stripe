import { NextResponse } from "next/server"
// @ts-ignore
import { validateCartItems } from "use-shopping-cart/utilities"

import { inventory } from "@/config/inventory"
import { stripe } from "@/lib/stripe"

export async function POST(request:Request) {
    try{console.log("inside")
    const cartDetails = await request.json()
    const lineItems = validateCartItems(inventory, cartDetails)
    const origin = request.headers.get('origin')
    console.log(origin)
    const session = await stripe.checkout.sessions.create({
        submit_type:"pay",
        mode:"payment",
        payment_method_types:['card'],
        line_items:lineItems,
        shipping_address_collection:{
            allowed_countries:['US']
        },
        shipping_options:[
            {
                shipping_rate:"shr_1NgyiCAiHYSRZc4rBJNTnfEH"
            }
        ],
        billing_address_collection:"auto",
        success_url:`${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${origin}/cart`
    })
    console.log(session)
    return NextResponse.json(session)
}
catch(error){
    console.error("Error creating checkout session: ",error)
    return NextResponse.json({error:"Failed to create checkout session"})
}
}
