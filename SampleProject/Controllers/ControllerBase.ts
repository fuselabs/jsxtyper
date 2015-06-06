/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../Libs/simplemvc.d.ts" />
/// <reference path="../Controls/DropdownMenu.ts" />
/// <reference path="../Dialogs/MessageBox.ts" />
/// <reference path="../Dialogs/ChangePasswordDialog.ts" />
/// <reference path="../Generated/ViewDefs.ts" />

module BankDemo.Controllers {
    /** 
     * This is the base class for all controllers in this app.
     * Here we render parts common to all pages, and handle events in those parts.
     */
    export class ControllerBase extends SimpleMvc.Controller {
        protected pageContent: Element;

        constructor(public app: BankApp) {
            super();
        }

        public load(params: SimpleMvc.QueryParams): void {
            super.load(params);

            // Render page
            var $content = $('<div id="content"></div>').appendTo($(document.body));
            var element = React.createElement(MasterPage, {});
            React.render(element, $content[0], () => {
                this.pageContent = $(MasterPageSelectors.pageContent)[0];
                this.attachHandlers();
            });
        }

        private attachHandlers(): void {
            $(MasterPageSelectors.goto).on('click', ev => this.onGotoClicked(ev));
            $(MasterPageSelectors.signOut).on('click', () => this.onSignOutClicked());
        }

        public onGotoClicked(ev: JQueryEventObject): void {
            // Add menu to DOM and position it
            var $menu = $("<div></div>").appendTo($(document.body));
            var gotoOffset = $(ev.target).offset();
            $menu.css({ left: gotoOffset.left + 'px', top: (gotoOffset.top + 25) + 'px' });

            // Display commands in the menu
            var commands = this.getCommands();
            var menu = new Controls.DropdownMenu($menu, { items: commands });
            menu.itemSelectedEvent.addListener((sender, ev) => {
                // Execute the selected command
                commands[ev.selectedItemIndex].action();
            });
        }

        public onSignOutClicked(): void {
            Dialogs.MessageBox.show("Thank you for clicking the sign out button.");
        }

        public onChangePassword(): void {
            var dialog = new Dialogs.ChangePasswordDialog();
            dialog.showDialog().done(() => {
                Dialogs.MessageBox.show("Your password has been updated.");
            });
        }

        /** Gets commands to be displayed in a menu. */
        public getCommands() {
            return [
                new Command("Pay bills"),
                new Command("Reorder checks"),
                new Command("Change password", () => this.onChangePassword()),
                new Command("Open a new account"),
                new Command("Investments"),
                new Command("Wire transfer"),
                new Command("Statements")
            ];
        }
    }

    /** Represents a command to be displayed in a menu. Each command has a label and an action method. */
    export class Command {
        constructor(public label: string, public action?: () => void) {
            if (!this.action)
                this.action = () => Dialogs.MessageBox.show("You selected: " + this.label);
        }

        public toString(): string {
            return this.label;
        }
    }
}
