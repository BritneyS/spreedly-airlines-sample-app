const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const {
  submitPayment,
  retrievePaymentInfoFromStore,
} = require("./scripts/gatewaysApi");
const submitPaymentToReceiver = require("./scripts/receiversApi");
const app = express();

// Security middleware
app.use(helmet());

// Error handling middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Body parsing middleware
app.use(bodyParser.json());

corsOptions = { origin: true };

// POST /purchase
app.post("/purchase", cors(corsOptions), async (req, res, next) => {
  try {
    const paymentToken = req.body.payment_token;
    const amountInCents = req.body.amount_in_cents;
    const purchaseResponse = await submitPayment(paymentToken, amountInCents);
    res.status(200).json(purchaseResponse);
  } catch (err) {
    next();
  }
});

// POST /receive
app.post("/receive", cors(corsOptions), async (req, res, next) => {
  try {
    const paymentToken = req.body.payment_token;
    const amountInCents = req.body.amount_in_cents;
    const purchaseResponse = await submitPaymentToReceiver(
      paymentToken,
      amountInCents
    );
    res.status(200).json(purchaseResponse);
  } catch (err) {
    next();
  }
});

// POST /store
app.post("/store", cors(corsOptions), async (req, res, next) => {
  try {
    const paymentToken = req.body.payment_token;
    const purchaseResponse = await retrievePaymentInfoFromStore(paymentToken);
    res.status(200).json(purchaseResponse);
  } catch (err) {
    next();
  }
});

app.listen(8080, () => {
  console.log(`Server listening on 8080`);
});
