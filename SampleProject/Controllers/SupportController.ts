/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../Libs/simplemvc.d.ts" />
/// <reference path="ControllerBase.ts" />
/// <reference path="../Generated/ViewDefs.ts" />

module BankDemo.Controllers {
    export class SupportController extends ControllerBase {
        constructor(app: BankApp) {
            super(app);
        }

        public load(params: SimpleMvc.QueryParams): void {
            super.load(params);

            var element = React.createElement(SupportPage, {});
            React.render(element, this.pageContent);
        }
    }
}
 