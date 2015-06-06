/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../Libs/simplemvc.d.ts" />
/// <reference path="../Models/Bank.ts" />
/// <reference path="../Generated/ViewDefs.ts" />
/// <reference path="ControllerBase.ts" />

module BankDemo.Controllers {
    export class HomeController extends ControllerBase {
        constructor(app: BankApp) {
            super(app);
        }

        public load(params: SimpleMvc.QueryParams): void {
            super.load(params);

            var props: HomePageProps = {
                accounts: this.app.getBank().getAccounts()
            };
            var element = React.createElement(HomePage, props);
            React.render(element, this.pageContent);
        }
    }
}
