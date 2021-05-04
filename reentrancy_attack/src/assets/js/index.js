import {initNEAR, login, logout, exec} from './blockchain'

async function flow(){
  if (!window.walletAccount.accountId){
    $("#logged-out").show()
  }else{
    $("#logged-in").show()
    $('#account').html(window.walletAccount.accountId)
  }
}

window.onload = function(){
  window.nearInitPromise = initNEAR()
  .then(flow)
  .catch(console.error)
}

window.login = login
window.logout = logout
window.exec = exec
