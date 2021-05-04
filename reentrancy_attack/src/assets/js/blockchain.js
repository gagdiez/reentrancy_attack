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


export async function exec(){
  let target = $('#target').val()
  let fc = $('#fc').val()
  let args = $('#args').val()
  let N = Number($('#times').val())
  let attached = nearAPI.utils.format.parseNearAmount($('#attached').val())
  let gas = $('#GAS').val()


  let args_enc = new Array()
  if(args){
    const enc = new TextEncoder();
    args_enc = Array.from(enc.encode(JSON.stringify(JSON.parse(args))))
  }

  console.log(target, fc, args_enc, N, attached, gas)
  let params = {target:target, fc:fc, args:args_enc, N:N,
                attach:attached, GAS:gas}

  const account = window.walletConnection.account()
  account.functionCall(
    nearConfig.contractName, 'call_N_times', 
    params, 300000000000000, attached
  )
}
