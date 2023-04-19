const Order = require("../model/order.model")
const fetch = require('node-fetch')

const getServiceList = async function(req ,res , next) {

    const body = {
          "key": process.env.PEAKER_API_KEY,
          "action":"services"
      }

      const response = await fetch(
        'https://peakerr.com/api/v2', 
     { 
      method : "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
      });
      const data = await response.json();
      const type = req.params.type
      if(data){
        return res.send(data.filter( element => element.name.includes(type)))
      }
      res.send("no services")
      
}
const addOrder = async function(req ,res  ,next ) {
   body = { 
    "key": process.env.PEAKER_API_KEY,
    "action" : "add",
    "service": req.body.service , 
    "link" : req.body.link , 
    "quantity" : req.body.quantity
   }
   try {

    const response = await fetch(
        'https://peakerr.com/api/v2', 
     { 
      method : "POST",
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
      });
      const data = await response.json();

      await Order.create({
        orderNumber : data.order , 
        userId : req.user._id , 
        service : body.service , 
        link : body.link 
      }).catch(e => {
        console.log(e);
        return res.send("the order hasn't been saved")
      })

      return res.send(data)
   } catch (error) {
        console.log(error);
       return  res.send("something went wrong along the way")
   }
  
}
const getCurrentUserAllOrders = async(req , res)=>{
    try {
        const list = await Order.find({
            userId : req.user._id
        })
        return res.json({list : list})
    } catch (error) {
        res.json({
            Message : "something went went in all orders"
        })
    }
}
const getOrderStatus = async (req ,res)=>{
    try {
        const order = await Order.find({orderNumber : req.params.id}).catch(e=>{
            return res.send(e)
        })

        const body = {
            "key": process.env.PEAKER_API_KEY,
            "action":"status",
            "order" : req.params.id
        }

        const response = await fetch(
            'https://peakerr.com/api/v2', 
         { 
          method : "POST",
          body: JSON.stringify(body),
          headers: {'Content-Type': 'application/json'}
          });
          const data = await response.json();

         return  res.json({
            order : order , 
            status : data
          })
        
    } catch (error) {
        res.json({
            message : "something went wrong while getting your order status"
        })
    }
}
const updateOrderStatus = async (req ,res) =>{
   try { 
    //format
    const { newStatus  , orderNumber }= req.body;
    //format
    const willUpdatedOrder = await Order.findOneAndUpdate({orderNumber : orderNumber}
        , { status : newStatus} , { new : true}).catch(e=>{
            return res.send(e)
        })

    res.json({
        message : "order status has been updated" , 
        newOrderStatus : willUpdatedOrder
    })}
    catch(error){
        res.json({
            errorMessage : "something went wrong while updating the status of the order"
        })
    }
}

module.exports = {
    getServiceList , 
    addOrder ,
    getCurrentUserAllOrders ,
    getOrderStatus ,
    updateOrderStatus
}