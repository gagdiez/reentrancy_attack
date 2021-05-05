import 'regenerator-runtime/runtime'
import * as nearAPI from "near-api-js";
let getConfig = require('./config')

const nearConfig = getConfig('testnet')

window.nearAPI = nearAPI

export function login() {
  walletConnection.requestSignIn(nearConfig.contractName, 'Simple Contract');
}

export function logout() {
  walletConnection.signOut()
  window.location.replace(window.location.origin + window.location.pathname)
}

export async function initNEAR() {
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect(Object.assign(nearConfig, {deps:{keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()}}));

  // Needed to access wallet login
  window.walletConnection = await new nearAPI.WalletConnection(window.near, nearConfig.contractName)
  window.walletAccount = walletConnection.account()

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await near.loadContract(
    nearConfig.contractName,
    {viewMethods: [],
     changeMethods: ['call_N_times'],
     sender: window.walletAccount.accountId}
  );
}


export async function exec(params, attached){
  const account = window.walletConnection.account()
  account.functionCall(
    nearConfig.contractName, 'call_N_times', 
    params, 300000000000000, attached
  )
}


export async function exec_and_return(params, attached){
  let result = await contract.account.functionCall(
    nearConfig.contractName, 'call_N_times', 
    params, 300000000000000, attached
  )
  return nearAPI.providers.getTransactionLastResult(result)
}
