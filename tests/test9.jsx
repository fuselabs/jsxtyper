var MemberPage = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function () {
    var borrowedBooksDisplay = null;
    if (this.state.borrowedBooks != null) {
        var bookList = [];
        for (var i = 0; i < this.state.borrowedBooks.length; i++) {
            var link = '#/book?id=' + this.state.borrowedBooks[i].BookId;
            bookList.push(<div><a href={link}>{this.state.borrowedBooks[i].Title}</a></div>);
        }
        if (!bookList.length) {
            bookList = <div>No books borrowed</div>
        }
        borrowedBooksDisplay =
            <div>
                <h4>Books borrowed</h4>
                {bookList}
            </div>;
    }
    else {
        borrowedBooksDisplay = <div><a href="#" className="books-borrowed">Show books borrowed</a></div>;
    }
    return (
      <div>
        <h2>Member Details</h2>
        <div className="form-row">
            <span className="field-name">First name:</span>
            <span>{this.props.member.FirstName}</span>
        </div>
        <div className="form-row">
            <span className="field-name">Last name:</span>
            <span>{this.props.member.LastName}</span>
        </div>
        {borrowedBooksDisplay}
      </div>
    );
  }
});
 
