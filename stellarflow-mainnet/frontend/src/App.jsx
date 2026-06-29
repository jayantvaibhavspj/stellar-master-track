import { useEffect, useState } from 'react';
import { FreighterApi } from '@stellar/freighter-api';
import { Server, Networks } from '@stellar/stellar-sdk';

const freighter = new FreighterApi();

function App() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [network, setNetwork] = useState('testnet');
  const [balance, setBalance] = useState('0');
  const [status, setStatus] = useState('Ready to connect');

  useEffect(() => {
    if (connected && publicKey) {
      loadBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, network]);

  const getHorizon = () => {
    return network === 'mainnet'
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org';
  };

  const loadBalance = async () => {
    try {
      const server = new Server(getHorizon());
      const account = await server.loadAccount(publicKey);
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      setBalance(nativeBalance?.balance ?? '0');
      setStatus('Wallet connected and balance loaded');
    } catch (error) {
      setStatus('Unable to load account balance. Make sure wallet is set to the selected network.');
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      setStatus('Checking Freighter availability...');
      const available = await freighter.isAvailable();
      if (!available) {
        setStatus('Freighter not found. Install Freighter to continue.');
        return;
      }

      setStatus('Connecting to Freighter...');
      const pk = await freighter.getPublicKey();
      if (!pk) {
        setStatus('Unable to retrieve public key from Freighter.');
        return;
      }

      setPublicKey(pk);
      setConnected(true);
      setStatus('Wallet connected successfully');
    } catch (error) {
      console.error(error);
      setStatus('Connection failed. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey('');
    setBalance('0');
    setStatus('Wallet disconnected');
  };

  return (
    <div className="app-shell">
      <header>
        <div className="logo">StellarFlow Mainnet</div>
        <button className="btn" onClick={connected ? disconnectWallet : connectWallet}>
          {connected ? 'Disconnect Wallet' : 'Connect Freighter'}
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
          <h2>Wallet onboarding</h2>
          <div className="network-switch">
            <label>
              <input
                type="radio"
                name="network"
                value="testnet"
                checked={network === 'testnet'}
                onChange={() => setNetwork('testnet')}
              />
              Testnet
            </label>
            <label>
              <input
                type="radio"
                name="network"
                value="mainnet"
                checked={network === 'mainnet'}
                onChange={() => setNetwork('mainnet')}
              />
              Mainnet
            </label>
          </div>
          <ul>
            <li>Network: {network}</li>
            <li>Status: {status}</li>
            <li>Wallet connected: {connected ? 'Yes' : 'No'}</li>
            {connected && <li>Public Key: {publicKey}</li>}
            {connected && <li>Balance: {balance} XLM</li>}
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
