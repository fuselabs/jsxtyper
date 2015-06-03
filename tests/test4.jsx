var DropdownMenuPanel = React.createClass({
  render: function () {
    var items = [];
    for (var i = 0; i < this.props.items.length; i++) {
      items.push(<div className="menu-item">{this.props.items[i]}</div>);
    }
    return (
      <div>{items}</div>
    );
  }
});
