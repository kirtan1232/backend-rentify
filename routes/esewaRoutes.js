var express = require("express");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/esewaController");
var router = express.Router();
 
// Route to handle the successful payment from Esewa
router.get("/success", verifyPayment);
 
// Route to create a new order and initiate the payment process
router.post("/create/:id", createOrder);
 
// Route to handle the failed payment from Esewa
// router.get("/failure", handleEsewaFailure);
 
module.exports = router;