import "./App.css";
import flights from "./data/flights";
import sendPayment from "./api/sendPayment";
import retrievePaymentInfo from "./api/retrievePaymentInfo";
import { useState } from "react";

function App() {
  const [customerCreditCardInfo, setCustomerCreditCardInfo] = useState({
    full_name: null,
    number: null,
  });
  function openSpreedlyExpress(amountInCents) {
    const amountField = document.getElementById("amount");
    amountField.setAttribute("value", amountInCents);

    const amount = centsToDollar(amountInCents);

    window.SpreedlyExpress.init(`${process.env.REACT_APP_ENV_KEY}`, {
      amount: `$${amount}`,
      company_name: "Acme Widgets",
      sidebar_top_description: "Providing quality widgets since 2015",
      sidebar_bottom_description: "Your order total today",
      full_name: "First Last",
    });
    window.SpreedlyExpress.openView();
  }

  /*
  After Spreedly Express tokenizes your customer’s payment method, the onPaymentMethod callback is triggered.
  Register a callback which takes the resulting payment method token and sends it to your servers for processing.
  */
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    window.SpreedlyExpress.onPaymentMethod(function (token, paymentMethod) {
      // Send requisite payment method info to backend
      const amountField = document.getElementById("amount");
      const amountInCents = amountField.getAttribute("value");

      const paymentTypeField = document.getElementById("payment_type");
      sendPayment(token, amountInCents, paymentTypeField.getAttribute("value"));
      retrievePaymentInfo(token).then((data) =>
        setCustomerCreditCardInfo({
          full_name: data["transaction"]["basis_payment_method"]["full_name"],
          number: data["transaction"]["payment_method"]["third_party_token"]
            .match(/\d(.*)/g)
            .join(),
        })
      );
    });
  };

  function centsToDollar(priceInCents) {
    return priceInCents / 100;
  }

  function handleDirectPaymentButtonClick(priceInCents) {
    const paymentTypeField = document.getElementById("payment_type");
    paymentTypeField.setAttribute("value", "direct");
    openSpreedlyExpress(priceInCents);
  }

  function handleReceiverPaymentButtonClick(priceInCents) {
    const paymentTypeField = document.getElementById("payment_type");
    paymentTypeField.setAttribute("value", "receiver");
    openSpreedlyExpress(priceInCents);
  }

  return (
    <main className="App">
      <header className="block mt-6">
        <h1 className="title is-1 has-text-grey-dark">Book A Flight</h1>
      </header>
      <section className="columns is-justify-content-center">
        <ul>
          {!flights
            ? "Loading..."
            : flights.map((flight) => {
                return (
                  <li key={flight.id} className="box shop-card column">
                    <div className="media-content">
                      <h2 className="is-size-5 has-text-weight-semibold">
                        {flight.from} / {flight.fromIATA} to {flight.to} /{" "}
                        {flight.toIATA}
                      </h2>
                      <p className="is-size-6">
                        Price:{" "}
                        <span className="has-text-weight-semibold has-text-primary-dark">
                          ${centsToDollar(flight.priceInCents)}
                        </span>
                      </p>
                      <form id="payment-form" onSubmit={handlePaymentSubmit}>
                        <input
                          type="hidden"
                          name="payment_method_token"
                          id="payment_method_token"
                        />
                        <input type="hidden" name="amount" id="amount" />
                        <input
                          type="hidden"
                          name="payment_type"
                          id="payment_type"
                        />
                        <div className=" is-flex is-flex-direction-column mx-6">
                          <button
                            className="button is-primary has-text-weight-semibold mb-3"
                            onClick={() =>
                              handleDirectPaymentButtonClick(
                                flight.priceInCents
                              )
                            }
                          >
                            Book ✈️
                          </button>
                          <button
                            className="button is-primary has-text-weight-semibold"
                            onClick={() =>
                              handleReceiverPaymentButtonClick(
                                flight.priceInCents
                              )
                            }
                          >
                            Book with Expedio ✈️
                          </button>
                        </div>
                      </form>
                    </div>
                  </li>
                );
              })}
        </ul>
      </section>
      <section className="columns is-justify-content-center my-6">
        <div className="box shop-card column">
          <div className="media-content">
            <h2 className="is-size-5 has-text-weight-semibold">
              Your Credit Card Info For Later
            </h2>
            <p>{`Full Name: ${customerCreditCardInfo.full_name}`}</p>
            <p>{`Number: ${customerCreditCardInfo.number}`}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
