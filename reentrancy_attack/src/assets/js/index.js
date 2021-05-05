import {initNEAR, login, logout, exec, exec_and_return} from './blockchain'

window.current_text = ""

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
window.exec = async function(){
  const target = $('#target').val()
  const fc = $('#fc').val()
  const args = editor.get()
  const N = Number($('#times').val())
  const attached = nearAPI.utils.format.parseNearAmount($('#attached').val())
  const gas = String(Number($('#gas').val()) * 10 ** 12) 

  let args_enc = new Array()
  if(args){
    const enc = new TextEncoder();
    args_enc = Array.from(enc.encode(JSON.stringify(args)))
  }

  let params = {target:target, fc:fc, args:args_enc, N:N,
                attach:attached, GAS:gas}
 
  // Reset UI
  current_text = ""

  if(attached>0){
    // If there is money, we will be redirected to NEAR
    $('#result').html = "You will be redirected to NEAR"
    exec(params, attached)
  }else{
    // If not, wait for it to finish
    $('#result').html('Contacting contract... <span id="spin" class="fas fa-sync fa-spin"></span>')

    await exec_and_return(params, attached)
    .then(respon => {$('#spin').hide(); console.info("Finished")})
    .catch(error => {$('#spin').hide(); console.error(error)})
  }
}

const container = document.getElementById("args")
const options = {mainMenuBar:false}
const editor = new JSONEditor(container, options)

// set json
const initialJson = {
    "array": [1, 2, 3],
    "boolean": true,
    "null": null,
    "number": 123,
    "object": {"a": "b", "c": "d"},
    "amount": "500000000000000000000000"
}

editor.set(initialJson)

window.n2yn = function(){
  $('#ynear').val(nearAPI.utils.format.parseNearAmount($('#near').val()))
}

// Capture console logs, errors, warn, info
function proxy(context, method, type) { 
  return function() {
    let text = Array.prototype.slice.apply(arguments).join(" ")
    text = "<span class='"+type+"'>"+text+"</span>"
    current_text = $('#result').html() + "<br>" + text
    $('#result').html(current_text)
    method.apply(context, arguments)
  }
}

// let's do the actual proxying over originals
console.log = proxy(console, console.log, 'text-success')
console.error = proxy(console, console.error, 'text-danger')
console.warn = proxy(console, console.warn, 'text-danger')
console.info = proxy(console, console.info, 'text-info')
