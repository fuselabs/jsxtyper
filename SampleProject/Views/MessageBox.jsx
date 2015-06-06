var MessageBoxPanel = React.createClass({
  render: function () {
    var cancelButton = this.props.hideCancelButton ? 
            <span></span> : <button type="button" className="cancel-button">{this.props.cancelButtonLabel}</button>
    return (
      <div className="message-box">
          <div className="message-box-message">{this.props.message}</div>
          <div className="button-panel">
              <button type="submit" className="ok-button default-button">{this.props.okButtonLabel}</button>&nbsp;
              {cancelButton}
          </div>
      </div>
    );
  }
});
