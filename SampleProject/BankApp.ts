/// <reference path="typings/tsd.d.ts" />
/// <reference path="Libs/simplemvc.d.ts" />
/// <reference path="Controllers/HomeController.ts" />
/// <reference path="Controllers/AccountController.ts" />
/// <reference path="Controllers/TransactionController.ts" />
/// <reference path="Controllers/SupportController.ts" />

module BankDemo {
    export class BankApp extends SimpleMvc.App {
        private bank = new Model.Bank();

        constructor() {
            super();

            var router = this.getRouter();
            router.addRoute("/", Controllers.HomeController);
            router.addRoute("/account", Controllers.AccountController);
            router.addRoute("/account/transaction", Controllers.TransactionController);
            router.addRoute("/support", Controllers.SupportController);

            this.load();
        }

        public getBank(): Model.Bank {
            return this.bank;
        }
    }
}

$(() => {
    new BankDemo.BankApp();
});
