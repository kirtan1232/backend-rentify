const crypto = require("crypto");
const { v4 } = require("uuid");

exports.createOrder = async (req, res, next) => {
  const { amount } = req.body;
  const roomId = req.params.id; // Use the room ID directly
  const transactionUuid = v4(); // Create a unique transaction ID

  console.log("The room id and rent amount is ", roomId, amount);

  const signature = this.createSignature(
    `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`
  );

  const formData = {
    amount: amount,
    failure_url: `http://localhost:5173/failure`, // Corrected URL
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: "EPAYTEST",
    signature: signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: `http://localhost:5173/success`, // Corrected URL
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid: transactionUuid,
  };

  res.json({
    message: "Order Created Successfully",
    formData,
    payment_method: "esewa",
  });
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    console.log(decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ message: "error" });
    }

    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");
    console.log(message);

    const roomId = decodedData.transaction_uuid.split("-")[0]; // Extract room ID
    console.log("The room id is " + roomId);

    if (decodedData.status !== "COMPLETE") {
      console.log("The status is not complete");
      return res.redirect(`http://localhost:3000/failure`);
    }

    res.redirect("http://localhost:3000/success");
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};
