const chargily = require("chargily-epay-gateway");
const User = require("../model/user.model");
const Profile = require("../model/profile.model");
const Transaction = require("../model/transaction.model");
const { Invoice } = require("chargily-epay-gateway/lib/configuration");
const { v4: uuidv4 } = require("uuid");
const CONVERT_RATE = 22;

const submitPayment = async (req, res, next) => {
  if (!req.user) return res.send("you have to login !");
  const { invoice, mode, backUrl, amount, client, discount, client_email } =
    req.body;
  // if( !invoice || !backUrl || !amount || !client || !discount || !client_email){
  //     return res.status(400).send("invalid order check your all params are there")
  // }
  console.log(req.body);
  try {
    const order = new Invoice();
    order.invoiceNumber = genInvoiceNumber(); // must be integer or string
    order.mode = mode; //Mode.EDAHABIA // or Mode.CIB
    order.backUrl = `${process.env.HOSTURL}/api/v1/home`; // must be a valid and active URL
    order.amount = amount; // must be integer , and more or equal 75
    order.webhookUrl = `${process.env.HOSTURL}/api/v1/payment/webhook`; // this URL where receive the response
    order.client = req.user.username;
    order.discount = "25"; // by percentage between [0, 100]
    order.clientEmail = req.user.email; // email of customer where he will receive the Bill
    order.appKey = process.env.CHARGILY_APP_KEY;
    console.log(order);
    const checkoutUrl = await chargily.createPayment(order).then((res) => {
      return res.checkout_url; // redirect to this url to process the checkout
    });
    res.status(201).redirect(checkoutUrl);
  } catch (e) {
    console.log(e);
    res.redirect(`${process.env.HOSTURL}/api/v1/home`);
  }
};
const webhookHandler = async (req, res, next) => {
  console.log("webhook");
  req.invoice = req.body.invoice;
  const { mode, invoice_number, amount, status } = req.invoice;
  console.log(req.user);
  console.log(req.invoice);
  console.log(status);
  if (status == "paid") {
    console.log("you have canceled your order");
  } else if (status == "canceled") {
    const user = await User.findOne({ username: req.invoice.client });
    const result = await User.findById(user._id).populate("profileId");
    console.log(result);
    const id = result.profileId;
    await Profile.findByIdAndUpdate(
      id,
      { coinsBalance: amount },
      { new: true }
    );
    const transResult = await Transaction.create({
      user: user,
      invoiceNumber: invoice_number,
      coins: amount / CONVERT_RATE,
      amountEquivalent: amount,
      transactionType: "recharge",
      mode: mode,
      note: "test",
    }).catch((e) => {
      console.log(e);
      console.log("the transaction didn't go through");
    });

    if (transResult) console.log("sheeesh you got cash");
    else console.log("just do it again");
  }
};
const genInvoiceNumber = () => {
  return "INV-" + uuidv4();
};
module.exports = {
  submitPayment,
  webhookHandler,
};
