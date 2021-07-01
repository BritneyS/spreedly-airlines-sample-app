require("dotenv").config();
const axios = require("axios");

const webClient = axios.create({
  baseURL: `https://core.spreedly.com/v1/gateways/${process.env.GATEWAY_TOKEN}`,
  headers: { "Content-Type": "application/json" },
  auth: {
    username: `${process.env.ENV_KEY}`,
    password: `${process.env.ACCESS_SEKRET}`,
  },
});

function submitPayment(paymentToken, amountInCents) {
  return webClient
    .post(`/purchase.json`, {
      transaction: {
        payment_method_token: `${paymentToken}`,
        amount: amountInCents,
        currency_code: "USD",
        retain_on_success: true,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { errorStatus: err.response.status, data: err.response.data };
      } else if (err.request) {
        // The request was made but no response was received
        return { error: `No response for request: ${err.request}` };
      } else {
        // Something happened in setting up the request that triggered an Error
        return { error: err.message };
      }
    });
}

module.exports = submitPayment;
