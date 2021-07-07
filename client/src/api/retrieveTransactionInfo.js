function retrieveTransactionInfo(paymentToken) {
  return fetch(`http://localhost:8080/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      payment_token: paymentToken,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default retrieveTransactionInfo;
