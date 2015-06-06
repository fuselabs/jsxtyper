/// <reference path="Account.ts" />

module BankDemo.Model {
    export class Bank {
        private checkingAccount = new Account(AccountType.Checking, 1000);
        private savingsAccount = new Account(AccountType.Savings, 5000);

        public getAccounts(): Account[] {
            var accounts = <Account[]>[];
            accounts.push(this.checkingAccount);
            accounts.push(this.savingsAccount);
            return accounts;
        }

        public getAccount(accountType: number): Account {
            if (accountType == AccountType.Checking)
                return this.checkingAccount;
            else
                return this.savingsAccount;
        }
    }
}
