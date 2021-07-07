const payment_method = {
  direct: "purchase",
  receiver: "receive",
};

function sendPayment(paymentToken, amountInCents, paymentType) {
  fetch(`http://localhost:8080/${payment_method[paymentType]}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      payment_token: paymentToken,
      amount_in_cents: amountInCents,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default sendPayment;
