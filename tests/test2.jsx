var BookPage = React.createClass({
  getInitialState: function() {
    return {
       checkedOutTo: this.props.initialBookDetails.CheckedOutTo,
       checkedOutToMember: null
    };
  },
  render: function () {
    var checkedOutToMemberRow = null;
    if (this.state.checkedOutToMember) {
        var memberUrl = "#/member?id=" + this.state.checkedOutToMember.MemberId;
        checkedOutToMemberRow =
            <div className="form-row">
                <span className="field-name">Borrower:</span>
                <span><a href={memberUrl}>{this.state.checkedOutToMember.FirstName} {this.state.checkedOutToMember.LastName}</a></span>
            </div>;
    }
    var status;
    if (this.state.checkedOutTo) {
        if (this.state.checkedOutToMember) {
            status = "Checked out";
        }
        else {
            status = <a href="#" className="checked-out-to">Checked out</a>
        }
    }
    else {
        status = "Available";
    }
    var lendingPanel = null;
    if (this.state.checkedOutTo) {
        lendingPanel = <div><button type="button" className="return-button">Return</button></div>;
    }
    else {
        if (this.state.lendingInitiated) {
            var borrowingMemberName = '(Press Find to find a member)';
            if (this.state.borrowingMember) {
               borrowingMemberName = this.state.borrowingMember.FirstName + ' ' + this.state.borrowingMember.LastName;
            }
            lendingPanel = 
               <div className="lending-panel">
                   <h3>Lending</h3>
                   <div>
                       <label>Lend to member:</label>
                       <div className="borrowing-member">{borrowingMemberName}</div>
                       <button type="button" className="find-button">Find...</button>
                   </div>
                   <div className="button-panel">
                       <button type="button" className="ok-button">OK</button>&nbsp;
                       <button type="button" className="cancel-button">Cancel</button>
                   </div>
               </div>;
        }
        else {
            lendingPanel = <div><button type="button" className="borrow-button">Lend...</button></div>;
        }
    }
    return (
      <div>
        <h2>Book Details</h2>
        <div className="form-row">
            <span className="field-name">Title:</span>
            <span>{this.props.initialBookDetails.Title}</span>
        </div>
        <div className="form-row">
            <span className="field-name">Author:</span>
            <span>{this.props.initialBookDetails.AuthorName}</span>
        </div>
        <div className="form-row">
            <span className="field-name">Status:</span>
            <span>{status}</span>
        </div>
        {checkedOutToMemberRow}
        {lendingPanel}
      </div>
    );
  }
});
