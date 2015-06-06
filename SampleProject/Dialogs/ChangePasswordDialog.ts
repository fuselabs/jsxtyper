/// <reference path="../typings/tsd.d.ts" />
/// <reference path="DialogBase.ts" />

module BankDemo.Dialogs {

    // How to use dialogs:
    //    var dialog = SomeDialog();
    //    dialog.field1 = "foo";
    //    dialog.field2 = "bar";
    //    dialog.showDialog().done(() => {
    //       // User pressed OK.
    //       // Here dialog.field1 and dialog.field2 will have new values entered by the user.
    //    });

    export class ChangePasswordDialog extends DialogBase {
        // public members
        public oldPassword = "";
        public newPassword = "";

        constructor() {
            super();
        }

        protected render(): void {
            var element = React.createElement(ChangePasswordPanel, {});
            React.render(element, this.$el[0], () => {
                this.init();
            });
        }

        protected init(): void {
            // Call base class method to complete initialization.
            super.init();
        }

        public onOK(): void {
            // Get new values from dialog controls.
            this.oldPassword = this.$el.find(ChangePasswordPanelSelectors.oldPasswordInput).val();
            this.newPassword = this.$el.find(ChangePasswordPanelSelectors.newPasswordInput).val();

            super.onOK();
        }
    }
}
