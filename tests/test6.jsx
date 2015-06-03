var FindMemberPanel = React.createClass({
  getInitialState: function() {
      return { memberResults: null };
  },
  render: function () {
    var memberResults = [];
    if (this.state.memberResults) {
        for (var i = 0; i < this.state.memberResults.length; i++) {
            var member = this.state.memberResults[i];
            memberResults.push(
                <div key={member.MemberId}>
                    <input type="radio" name="MemberId" className="member-radio" value={member.MemberId} />
                    <label>{member.FirstName} {member.LastName}</label>
                </div>
            );
        }
    }
    return (
      <div className="find-member-dialog">
          <div>
              <div>Type a few characters of the member's name:</div>
              <div className="find-row">
                  <input type="text" className="member-name-input" />
                  <button type="button" className="member-find-button">Find</button>
              </div>
          </div>
          <div className="member-results">
              {memberResults}
          </div>
          <div className="button-panel">
              <button type="submit" className="ok-button default">OK</button>&nbsp;
              <button type="button" className="cancel-button">Cancel</button>&nbsp;
          </div>
      </div>
    );
  }
});
