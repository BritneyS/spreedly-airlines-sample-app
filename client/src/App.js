import "./App.css";
import flights from "./data/flights";
import sendPayment from "./api/sendPayment";

function App() {
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

      sendPayment(token, amountInCents);
    });
  };

  function centsToDollar(priceInCents) {
    return priceInCents / 100;
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
                        <button
                          className="button is-primary has-text-weight-semibold"
                          onClick={() =>
                            openSpreedlyExpress(flight.priceInCents)
                          }
                        >
                          Book ✈️
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
        </ul>
      </section>
    </main>
  );
}

export default App;
