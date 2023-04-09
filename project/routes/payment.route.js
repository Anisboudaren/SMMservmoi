const chargily = require('chargily-epay-gateway')
const paymentRouter = require('express').Router()
//db
const User  = require('../model/user.model')
const Profile = require('../model/profile.model')
const {Invoice, Mode} = require("chargily-epay-gateway/lib/configuration");


paymentRouter.post("/submit-payment" , async (req , res)=>{
    if(!req.user) return res.send("you have to login !")
    const { invoice , mode , backUrl , amount , client , discount , client_email} = req.body;
    // if( !invoice || !backUrl || !amount || !client || !discount || !client_email){
    //     return res.status(400).send("invalid order check your all params are there")
    // }
    console.log(req.body);

    const order = new Invoice()
    order.invoiceNumber = "test" // must be integer or string
    order.mode = mode //Mode.EDAHABIA // or Mode.CIB
    order.backUrl = "https://b631-105-107-38-29.ngrok-free.app/home" // must be a valid and active URL
    order.amount = amount // must be integer , and more or equal 75
    order.webhookUrl = "https://b631-105-107-38-29.ngrok-free.app/api/v1/payment/webhook" // this URL where receive the response 
    order.client = req.user.username
    order.discount = 25 // by percentage between [0, 100]
    order.clientEmail = req.user.email // email of customer where he will receive the Bill
    order.appKey = process.env.CHARGILY_APP_KEY 

    const checkoutUrl = await chargily.createPayment(order).then( res => {
        return res.checkout_url // redirect to this url to process the checkout 
     })
     res.status(201).redirect(checkoutUrl)
    
})

paymentRouter.post("/webhook" , async(req , res) => {
  console.log("webhook");
  req.invoice = req.body.invoice
      const { id , client ,  invoice_number , amount , status } = req.body.invoice
      console.log(req.body);
      if(status == "canceled") {
        res.render("home", {client : `Mr ${client} , you have canceled the order`})
      }else {
      
        res.render("home", {client : `the order was successful here is you new information and your new balance is ${await getBalance(req.user._id)} `})
      }
})

async function getBalance(id  ) {
  const result =  await User.findById(id)
  .populate('profileId')
  return result.profileId.coinsBalance;
}


module.exports = paymentRouter