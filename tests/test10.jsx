var MembersPage = React.createClass({
  getInitialState: function() {
    return {
       members: this.props.initialMembers
    };
  },
  render: function () {
    var memberRows = [];
    if (this.state.members != null) {
        for (var i = 0; i < this.state.members.length; i++) {
            var member = this.state.members[i];
            memberRows.push(
                <div key={member.MemberId}>
                    <input type="radio" name="MemberId" className="member-radio" value={member.MemberId} />
                    <label>{member.FirstName} {member.LastName}</label>
                </div>
            );
        }
    }
    return (
      <div className="members-page">
          <h2>Member Maintenance</h2>
          <div className="button-bar">
              <button type="button" className="create-button">New Member...</button>
              <button type="button" className="edit-button">Edit</button>
              <button type="button" className="delete-button">Delete</button>
          </div>
          <div className="member-list">
              {memberRows}
          </div>
      </div>
    );
  }
});
