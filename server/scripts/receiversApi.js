require("dotenv").config();
const axios = require("axios");

const webClient = axios.create({
  baseURL: `https://core.spreedly.com/v1/receivers/${process.env.RECEIVER_TOKEN}`,
  headers: { "Content-Type": "application/json" },
  auth: {
    username: `${process.env.ENV_KEY}`,
    password: `${process.env.ACCESS_SEKRET}`,
  },
});

function submitPaymentToReceiver(paymentToken, amountInCents) {
  return webClient
    .post(`/deliver.json`, {
      delivery: {
        payment_method_token: `${paymentToken}`,
        url: "https://spreedly-echo.herokuapp.com",
        headers: "Content-Type: application/json",
        body: `{ "amount": ${amountInCents}, "card_number": "{{credit_card_number}}" }`,
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

module.exports = submitPaymentToReceiver;
