import { get_user, deposit, withdraw_reentrance } from '..';
import { User } from '../model';
import { storage, Context, u128, logging, VMContext,
         ContractPromiseResult } from "near-sdk-as";


function withdraw_11():void{
  withdraw_reentrance(u128.from(11))
}


describe("Deposit and Withdraw", () => {
  it("correctly deposits/withdraws money", () => {

    VMContext.setPredecessor_account_id(Context.contractName)

    const subjects:i32 = 3
    for(let i=0; i < subjects; i++){
      VMContext.setPrepaid_gas(300000000000000)
      VMContext.setPredecessor_account_id(i.toString())
      VMContext.setAttached_deposit(u128.from((i+1)*10))
      deposit()
    }
    
    let expected_balances:Array<i32> = [10, 20, 30]
    
    for(let i:i32=0; i < subjects; i++){
      VMContext.setPrepaid_gas(300000000000000)
      let user:User = get_user(i.toString())
      expect(user.balance).toBe(u128.from(expected_balances[i]))
    }

    VMContext.setPredecessor_account_id("2")
    expect(withdraw_11).not.toThrow()
    expect(withdraw_11).not.toThrow()
    expect(withdraw_11).toThrow()
  });
})
