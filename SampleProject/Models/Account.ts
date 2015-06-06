/// <reference path="../Libs/simplemvc.d.ts" />

module BankDemo.Model {
    export enum AccountType { Checking, Savings };

    /** Represents a bank account */
    export class Account {
        private name: string;
        private balance: number;

        constructor(private accountType: AccountType, balance: number) {
            this.name = (accountType == AccountType.Checking) ? "Fee Maximizer Checking" : "Interest Free Savings";
            this.balance = balance;
        }

        public getAccountType(): AccountType {
            return this.accountType;
        }

        public getName(): string {
            return this.name;
        }

        public getBalance(): number {
            return this.balance;
        }

        public depositMoney(amount: number): void {
            if (!amount)
                throw new SimpleMvc.Exception("Invalid amount");
            this.balance = this.balance + amount;
        }

        public withdrawMoney(amount: number): void {
            if (!amount)
                throw new SimpleMvc.Exception("Invalid amount");
            if (amount > this.balance)
                throw new SimpleMvc.Exception("Amount exceeds balance");
            this.balance = this.balance - amount;
        }
    }
}
