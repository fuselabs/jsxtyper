var EditMemberPanel = React.createClass({
  render: function () {
    return (
      <div className="edit-member-dialog">
          <div>
              <label>First name:</label>
              <input type="text" className="input-first-name" defaultValue={this.props.firstName} />
          </div>
          <div>
              <label>Last name:</label>
              <input type="text" className="input-last-name" defaultValue={this.props.lastName} />
          </div>
          <div className="button-panel">
              <button type="submit" className="ok-button default">OK</button>&nbsp;
              <button type="button" className="cancel-button">Cancel</button>&nbsp;
          </div>
      </div>
    );
  }
});
