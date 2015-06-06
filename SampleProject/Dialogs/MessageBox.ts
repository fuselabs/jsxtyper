/// <reference path="../typings/tsd.d.ts" />
/// <reference path="DialogBase.ts" />
/// <reference path="../Generated/ViewDefs.ts" />

module BankDemo.Dialogs {
    export class MessageBox extends DialogBase {
        public message: string;
        private options: MessageBoxOptions;

        constructor(options: MessageBoxOptions) {
            this.options = $.extend({}, DefaultMessageBoxOptions, options);
            super();
        }

        protected render(): void {
            var props: MessageBoxPanelProps = {
                okButtonLabel: this.options.okButtonLabel,
                cancelButtonLabel: this.options.cancelButtonLabel,
                hideCancelButton: this.options.hideCancelButton,
                message: this.message
            };
            var element = React.createElement(MessageBoxPanel, props);
            React.render(element, this.$el[0], () => {
                this.init();
            });
        }

        protected init(): void {
            // Call base class method to complete initialization.
            super.init();
        }

        /** Static method for displaying a simple message. */
        public static show(message: string): JQueryPromise<any> {
            var mb = new MessageBox({ hideCancelButton: true });
            mb.message = message;
            return mb.showDialog();
        }

        /** Static method for asking the user a yes/no question. OK/Cancel buttons are relabeled to Yes/No. */
        public static ask(title: string, message: string): JQueryPromise<any> {
            var mb = new MessageBox({ okButtonLabel: "Yes", cancelButtonLabel: "No", dialogTitle: title });
            mb.message = message;
            return mb.showDialog();
        }
    }

    export interface MessageBoxOptions {
        hideCancelButton?: boolean;
        okButtonLabel?: string;
        cancelButtonLabel?: string;
    }

    var DefaultMessageBoxOptions: MessageBoxOptions = {
        hideCancelButton: false,
        okButtonLabel: 'OK',
        cancelButtonLabel: 'Cancel'
    };
}
