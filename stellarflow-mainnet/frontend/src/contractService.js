import { Asset, Networks, Operation, Server, TransactionBuilder, Memo } from '@stellar/stellar-sdk';

const CONTRACT_PLACEHOLDER = 'GBRPYHIL2C4ZMFJ7EGXMJRQYZW7S3EVPKMZ6L3Q37SM4D7F2UWYZW4Y5';

export function getServer(network) {
  const url = network === 'mainnet'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org';
  return new Server(url);
}

export function getNetworkPassphrase(network) {
  return network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
}

export async function buildStreamTransaction({ publicKey, network }) {
  const server = getServer(network);
  const account = await server.loadAccount(publicKey);

  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: getNetworkPassphrase(network),
  })
    .addOperation(Operation.payment({
      destination: publicKey,
      asset: Asset.native(),
      amount: '0.00001',
    }))
    .addMemo(Memo.text('StellarFlow stream placeholder'))
    .setTimeout(180)
    .build();

  return tx;
}

export async function getContractStatus(network) {
  const server = getServer(network);
  try {
    const account = await server.loadAccount(CONTRACT_PLACEHOLDER);
    return {
      contractId: CONTRACT_PLACEHOLDER,
      exists: true,
      sequence: account.sequence,
    };
  } catch (error) {
    return {
      contractId: CONTRACT_PLACEHOLDER,
      exists: false,
      error: error.message,
    };
  }
}
