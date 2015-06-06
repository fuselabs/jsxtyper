/// <reference path="../typings/tsd.d.ts" />
/// <reference path="KeyCodes.ts" />

module BankDemo.Controls {
    export class DropdownMenu {
        // Events
        public itemSelectedEvent = new SimpleMvc.Event<DropdownMenu, MenuItemSelectedEventArgs>();

        // Css classes
        private menuCssClass = "dropdown-menu";
        private highlightCssClass = "highlight";

        // Private members
        private ops: DropdownMenuOptions;

        constructor(private $el: JQuery, options?: DropdownMenuOptions) {
            this.ops = $.extend({}, DefaultDropdownMenuOptions, options);
            this.render();
            this.$el.focus();
            this.handleEvents();
        }

        private render(): void {
            this.$el.addClass(this.menuCssClass).attr("tabindex", "0");
            if (this.ops.items && this.ops.items.length) {
                var labels = this.ops.items.map(value => value.toString());
                var element = React.createElement(DropdownMenuPanel, { items: labels });
                React.render(element, this.$el[0]);
            }
        }

        private handleEvents(): void {
            this.$el.on('blur', () => this.close());
            this.$el.on('mouseover', DropdownMenuPanelSelectors.menuItem, ev => this.onMouseOverItem(ev));
            this.$el.on('mouseout', ev => this.$el.find('.' + this.highlightCssClass).removeClass(this.highlightCssClass));
            this.$el.on('mousedown', ev => this.onItemSelected(this.$el.find('.' + this.highlightCssClass)));
            this.$el.on('keydown', ev => this.onKeyDown(ev));
        }

        private onMouseOverItem(ev: JQueryEventObject): void {
            this.$el.find('.' + this.highlightCssClass).removeClass(this.highlightCssClass);
            $(ev.currentTarget).addClass(this.highlightCssClass);
        }

        private onKeyDown(ev: JQueryEventObject): void {
            switch (ev.which) {
                case KeyCodes.Escape:
                    this.close();
                    break;
                case KeyCodes.Enter:
                    this.onItemSelected(this.$el.find('.' + this.highlightCssClass));
                    break;
                case KeyCodes.UpArrow:
                case KeyCodes.DownArrow:
                    var $items = this.$el.find(DropdownMenuPanelSelectors.menuItem);
                    var $highlighted = this.$el.find('.' + this.highlightCssClass);
                    var index = $items.index($highlighted);
                    var newIndex;
                    if (ev.which == KeyCodes.UpArrow)
                        newIndex = (index == -1 || index == 0) ? $items.length - 1 : index - 1;
                    else
                        newIndex = (index == -1 || index == $items.length - 1) ? 0 : index + 1;
                    $highlighted.removeClass(this.highlightCssClass);
                    $items.eq(newIndex).addClass(this.highlightCssClass);
                    break;
            }
            ev.preventDefault();
            ev.stopPropagation();
        }

        private onItemSelected($item: JQuery): void {
            var index = this.$el.find(DropdownMenuPanelSelectors.menuItem).index($item);
            if (index != -1) {
                this.itemSelectedEvent.trigger(this, { selectedItemIndex: index });
                this.close();
            }
        }

        private close(): void {
            this.$el.remove();
        }
    }

    export interface DropdownMenuOptions {
        /** Items to display in the menu. Set to null if menu items are already rendered. */
        items?: any[];
    }

    export var DefaultDropdownMenuOptions: DropdownMenuOptions = {
        items: null
    };

    export class MenuItemSelectedEventArgs extends SimpleMvc.EventArgs {
        public selectedItemIndex: number;
    }
}
 