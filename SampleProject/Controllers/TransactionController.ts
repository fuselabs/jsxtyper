/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../Libs/simplemvc.d.ts" />
/// <reference path="../Dialogs/MessageBox.ts" />
/// <reference path="../Generated/ViewDefs.ts" />
/// <reference path="ControllerBase.ts" />

module BankDemo.Controllers {
    export class TransactionController extends ControllerBase {
        private accountType: number;
        private depositing: boolean;
        private account: Model.Account;
        private component: React.Component<TransactionPageProps, TransactionPageState>;
        private state: TransactionPageState;

        constructor(app: BankApp) {
            super(app);
        }

        public load(params: SimpleMvc.QueryParams): void {
            super.load(params);

            // Get data based on query parameters
            this.accountType = parseInt(params["type"]);
            this.account = this.app.getBank().getAccount(this.accountType);
            this.depositing = (params["mode"] == "deposit");

            // Render page
            var props: TransactionPageProps = {
                labels: this.depositing ? this.depositLabels : this.withdrawalLabels,
                accountName: this.account.getName()
            };
            var element = React.createElement(TransactionPage, props);
            this.component = React.render<TransactionPageProps, TransactionPageState>(element, this.pageContent, () => {
                this.attachEventHandlers();
            });
            this.state = { balance: this.account.getBalance() };
            this.component.setState(this.state);
        }

        private attachEventHandlers(): void {
            $(TransactionPageSelectors.okButton).on('click', () => this.onOkClicked());
            $(TransactionPageSelectors.cancelButton).on('click', () => this.onCancelClicked());
        }

        private onOkClicked(): void {
            if (this.depositing)
                this.performDeposit();
            else
                this.performWithdrawal();
        }

        private performDeposit(): void {
            var amountStr = $(TransactionPageSelectors.amountInput).val();
            var amount = parseInt(amountStr);
            try {
                this.account.depositMoney(amount);
                this.state.balance = this.account.getBalance();
                this.component.setState(this.state);
                Dialogs.MessageBox.show("Amount deposited.").done(() => {
                    this.app.navigate("/");
                });
            }
            catch (ex) {
                Dialogs.MessageBox.show((<SimpleMvc.Exception>ex).message);
            }
        }

        private performWithdrawal(): void {
            var amountStr = $(TransactionPageSelectors.amountInput).val();
            var amount = parseInt(amountStr);
            try {
                this.account.withdrawMoney(amount);
                this.state.balance = this.account.getBalance();
                this.component.setState(this.state);
                Dialogs.MessageBox.show("Amount withdrawn.").done(() => {
                    this.app.navigate("/");
                });
            }
            catch (ex) {
                Dialogs.MessageBox.show((<SimpleMvc.Exception>ex).message);
            }
        }

        private onCancelClicked(): void {
            this.app.navigate("/account", { type: this.accountType.toString() });
        }

        private depositLabels: TransactionPageStrings = {
            transactionType: "Deposit",
            prompt: "How much do you want to deposit?"
        };

        private withdrawalLabels: TransactionPageStrings = {
            transactionType: "Withdrawal",
            prompt: "How much do you want to withdraw?"
        };
    }

    export interface TransactionPageStrings {
        transactionType: string;
        prompt: string;
    }
}
 