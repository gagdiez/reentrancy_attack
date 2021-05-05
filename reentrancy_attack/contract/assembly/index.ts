import {storage, context, env, u128, ContractPromise, ContractPromiseBatch,
        ContractPromiseResult, logging, math, PersistentVector} from "near-sdk-as";
import {user_to_idx, user_balance, User} from "./model"

const dGAS:u64 = 20000000000000

export function call_N_times(target:string, fc:string, args:Array<u8>,
                             N:u32, attach:u128=u128.Zero, GAS:u64=dGAS):void{
  // Target: address of the contract we want to call 3 times
  // fc: function within the contract to call
  // args: json.stringify of the fc arguments, encoded as uint8array
  // N: number of times to call the function
  // attach: Amount of money to attach in the call
  // GAS: gas attached to each call
  assert(attach <= context.attachedDeposit, "Need to attach more money")
  

  let encoded_args = new Uint8Array(args.length)
  for(let i=0; i < args.length; i++){
    encoded_args[i] = args[i]
  }
 
  logging.log("Calling " + fc + " on " + target + " " + N.toString() + " times")

  let cp = ContractPromiseBatch.create(target)
  for(let i:u32=1; i <= N; i++){
   cp.function_call(fc, encoded_args, attach, GAS)
  }
} 
