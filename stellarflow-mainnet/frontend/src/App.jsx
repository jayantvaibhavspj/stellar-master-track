import { useEffect, useState } from 'react';
import { FreighterApi } from '@stellar/freighter-api';
import { Server } from '@stellar/stellar-sdk';
import { buildStreamTransaction, getContractStatus, getNetworkPassphrase } from './contractService';

const freighter = new FreighterApi();

function App() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [network, setNetwork] = useState('testnet');
  const [balance, setBalance] = useState('0');
  const [status, setStatus] = useState('Ready to connect');
  const [contractInfo, setContractInfo] = useState(null);
  const [txResult, setTxResult] = useState('');
  const [contractStatus, setContractStatus] = useState('Not checked');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('1');
  const [duration, setDuration] = useState('30');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    if (connected && publicKey) {
      loadBalance();
      checkContract();
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

  const checkContract = async () => {
    setContractStatus('Checking contract status...');
    const status = await getContractStatus(network);
    setContractInfo(status);
    setContractStatus(status.exists ? 'Contract exists on network' : `Contract not found: ${status.error}`);
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
    setContractInfo(null);
    setContractStatus('Not checked');
    setTxResult('');
  };

  const signTransaction = async () => {
    if (!connected) {
      setStatus('Connect wallet first.');
      return;
    }

    if (!destination) {
      setStatus('Please enter a destination public key.');
      return;
    }

    setStatus('Preparing stream transaction...');
    try {
      const tx = await buildStreamTransaction({ publicKey, network, destination, amount, duration, frequency });
      const txBase64 = tx.toEnvelope().toXDR('base64');
      const signed = await freighter.signTransaction(txBase64, {
        network: getNetworkPassphrase(network),
      });

      setTxResult(JSON.stringify(signed, null, 2));
      setStatus('Transaction prepared and signed successfully');
    } catch (error) {
      console.error(error);
      setTxResult('');
      setStatus('Transaction signing failed.');
    }
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

        <section className="stream-card">
          <h2>Build a payment stream</h2>
          <p>Create a placeholder stream transaction that can be signed and submitted to a future contract.</p>
          <div className="stream-form">
            <label>
              Recipient public key
              <input
                type="text"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="G..."
              />
            </label>
            <label>
              Amount (XLM)
              <input
                type="number"
                min="0.00001"
                step="0.00001"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>
            <label>
              Duration (days)
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </label>
            <label>
              Frequency
              <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>
        </section>

        <section className="contract-card">
          <h2>Contract integration</h2>
          <p>Contract status: {contractStatus}</p>
          {contractInfo && contractInfo.exists && (
            <ul>
              <li>Contract ID: {contractInfo.contractId}</li>
              <li>Sequence: {contractInfo.sequence}</li>
            </ul>
          )}
          <button className="btn" onClick={signTransaction} disabled={!connected}>
            Prepare & Sign Stream Transaction
          </button>
          {txResult && (
            <div className="tx-result">
              <h3>Signed transaction data</h3>
              <pre>{txResult}</pre>
            </div>
          )}
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
