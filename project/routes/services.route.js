const serviceRouter = require('express').Router();
const serviceController = require("../controllers/services.controller");

serviceRouter.get("/list/:type" , serviceController.getServiceList);
serviceRouter.post("/order/add" , serviceController.addOrder);
serviceRouter.get("/order/all" , serviceController.getCurrentUserAllOrders);
serviceRouter.get("/order/status/:id" , serviceController.getOrderStatus)
serviceRouter.post("/order/status/update" , serviceController.updateOrderStatus);

module.exports = serviceRouter