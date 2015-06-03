var MasterPage = React.createClass({
  render: function () {
    return (
      <div>
        <div className="header">
            <div className="company-name">Lending Library</div>
            <div className="loading"></div>
            <div className="rhs">
                <div className="sign-out">Sign out</div>
            </div>
        </div>
        <div className="leftnav">
            <div><a href="#/">All Books</a></div>
            <div><a href="#/members">Member Maintenance</a></div>
        </div>
        <div className="leftnav-underlay"></div>
        <div className="page-content"></div>
      </div>
    );
  }
});
