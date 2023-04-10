const paymentRouter = require('express').Router()
const paymentController = require('../controllers/payment.controller')

paymentRouter.post("/submit-payment" , paymentController.submitPayment )
paymentRouter.post("/webhook"  , paymentController.webhookHandler )

module.exports = paymentRouter