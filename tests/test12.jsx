var TransactionPage = React.createClass({
  getInitialState: function () {
    return { balance: 0 };
  },
  render: function () {
    return (
      <div>
        <h2>{this.props.accountName} - {this.props.labels.transactionType}</h2>
        <div>Your balance is <span className="balance">{this.state.balance}</span></div>
        <br />
        <div>
            <div>{this.props.labels.prompt}</div>
            <div>$<input type="text" className="amount-input" /></div>
        </div>
        <br />
        <div className="button-bar">
            <button type="button" className="ok-button">OK</button>&nbsp;
            <button type="button" className="cancel-button">Cancel</button>
        </div>
      </div>
    );
  }
});
