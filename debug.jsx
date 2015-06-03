var AccountPage = React.createClass({
  render: function () {
    return (
      <div>
        <h2>{this.props.account.getName()}</h2>
        <div>Your balance is {this.props.account.getBalance()}</div>
        <br />
        <div className="button-bar">
            <button type="button" className="widthdraw-button">Withdraw</button>&nbsp;
            <button type="button" className="deposit-button">Deposit</button>
        </div>
      </div>
    );
  }
});
