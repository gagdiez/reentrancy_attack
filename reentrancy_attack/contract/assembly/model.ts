import { PersistentVector, PersistentMap, u128, math } from "near-sdk-as";

@nearBindgen
export class User{
  constructor(public name:string,
              public balance:u128){}
}

export const user_to_idx = new PersistentMap<string, i32>('a')
export let user_balance = new PersistentVector<u128>('b')
