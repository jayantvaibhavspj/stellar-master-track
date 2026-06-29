import { useState } from 'react';

function App() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="app-shell">
      <header>
        <div className="logo">StellarFlow Mainnet</div>
        <button className="btn" onClick={() => setConnected(!connected)}>
          {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
      </header>

      <main>
        <section className="hero">
          <h1>Real-time payment streams on Stellar Mainnet</h1>
          <p>
            Launch your mainnet payment streaming product with wallet onboarding, live
            transaction history, and growth-ready analytics.
          </p>
        </section>

        <section className="status-card">
          <h2>Startup status</h2>
          <ul>
            <li>Target: 50+ mainnet users</li>
            <li>Product launch: Mainnet-ready stream payments</li>
            <li>Current status: {connected ? 'Wallet connected' : 'Wallet disconnected'}</li>
          </ul>
        </section>

        <section className="next-steps">
          <h2>Next steps</h2>
          <ol>
            <li>Complete contract mainnet integration</li>
            <li>Create stream onboarding flow</li>
            <li>Collect user feedback and grow</li>
          </ol>
        </section>
      </main>
    </div>
  );
}

export default App;
