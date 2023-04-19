const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY,{
    apiVersion:'2023-04-04'
})

const createCheckoutSession = async (customerID, price) =>{
    const session = await Stripe.checkout.sessions.create({
        mode:'subscription',
        payment_method_types:['card'],
        customer:customerID,
        line_items:[
            {
                price,
                quantity:1
            }
        ],
        consent_collection:{
            terms_of_service:'required',
        },
        allow_promotion_codes:true,
        success_url: `${process.env.DOMAIN}?success=1`,
        cancel_url: `${process.env.DOMAIN}`
    })
    return session
}

const createBillingSession = async(customer) =>{
    const session = await Stripe.billingPortal.sessions.create({
        customer,
        return_url:'https://localhost:3000'
    })
}

const getCustomerByID= async(id)=> {
    const customer = await Stripe.customers.retrieve(id)
    return customer
}
const addNewCustomer= async(email)=> {
    const customer = await Stripe.customer.create({
    email,
    description:'New Customer'
})
return customer
}

const createWebhook = (rawBody, sig)=>{
    const event = Stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    )
    return event
}

module.exports ={
    getCustomerByID,
    addNewCustomer,
    createCheckoutSession,
    createBillingSession,
    createWebhook
}