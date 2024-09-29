import {Stripe} from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req:Request){
    try {
        const body = await req.json();
        
        const {payment_method_id,payment_intent_id,customer_id} = body;
        if(!payment_method_id||!payment_intent_id||!customer_id){
            return new Response(JSON.stringify({error:"Please enter a valid email address",status:400}))
        }

        const paymentMethod = await stripe.paymentMethods.attach(payment_method_id,{
            customer : customer_id
        })

        const result = await stripe.paymentIntents.confirm(payment_intent_id,{
            payment_method: paymentMethod.id
        })

        return new Response(
            JSON.stringify({
                success:true,
                message:"Payment confirmed successfully"
            })
        )
    } catch (error) {
        return new Response(
            JSON.stringify({
                success:false,
                message:error
            })
        )
    }
}
