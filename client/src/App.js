import "./App.css";
import flights from "./data/flights";

function App() {
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
                          ${flight.priceInCents / 100}
                        </span>
                      </p>
                      <button className="button is-primary has-text-weight-semibold">
                        Book ✈️
                      </button>
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
