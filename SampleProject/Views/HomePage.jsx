var HomePage = React.createClass({
  render: function () {
    var rows = [];
	for (var i = 0; i < this.props.accounts.length; i++) {
      rows.push(
        <tr key={this.props.accounts[i].getAccountType()}>
          <td><a href={"#/account?type=" + this.props.accounts[i].getAccountType()}>{this.props.accounts[i].getName()}</a></td>
          <td>{this.props.accounts[i].getBalance()}</td>
        </tr>
      );
    }
    return (
      <div>
        <h2>Accounts</h2>
        <table className="accounts-table">
            <thead>
                <tr>
                    <th>Account Name</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});
