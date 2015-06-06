/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../Libs/simplemvc.d.ts" />
/// <reference path="../Generated/ViewDefs.ts" />
/// <reference path="ControllerBase.ts" />

module BankDemo.Controllers {
    export class AccountController extends ControllerBase {
        private accountType: number;
        private account: Model.Account;

        constructor(app: BankApp) {
            super(app);
        }

        public load(params: SimpleMvc.QueryParams): void {
            super.load(params);

            // Get data based on query parameters.
            this.accountType = parseInt(params["type"]);
            this.account = this.app.getBank().getAccount(this.accountType);

            // Render page.
            var props: AccountPageProps = {
                account: this.account
            };
            var element = React.createElement(AccountPage, props);
            React.render(element, this.pageContent, () => {
                this.attachEventHandlers();
            });
        }

        private attachEventHandlers(): void {
            $(AccountPageSelectors.widthdrawButton).on('click', () => this.onWithdrawClicked());
            $(AccountPageSelectors.depositButton).on('click', () => this.onDepositClicked());
        }

        private onDepositClicked(): void {
            this.app.navigate("/account/transaction", { "type": this.accountType.toString(), mode: "deposit" });
        }

        private onWithdrawClicked(): void {
            this.app.navigate("/account/transaction", { "type": this.accountType.toString(), mode: "withdrawal" });
        }
    }
}
