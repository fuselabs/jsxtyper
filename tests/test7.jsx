var HomePage = React.createClass({
  render: function () {
    var rows = [];
    for (var i = 0; i < this.props.books.length; i++) {
        rows.push(<tr>
                      <td><a href={'#/book?id=' + this.props.books[i].BookId}>{this.props.books[i].Title}</a></td>
                      <td>{this.props.books[i].CheckedOutTo ? "Checked out" : "Available"}</td>
                  </tr>);
    }
    return (
      <div>
        <h2>All Books</h2>
        <table className="books-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});
