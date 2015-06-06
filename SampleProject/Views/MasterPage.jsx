var MasterPage = React.createClass({
  render: function () {
    return (
      <div>
        <div className="header">
            <div className="company-name">Mega Bank</div>
            <div className="rhs">
                <div className="goto">Go to</div>
                <div className="sign-out">Sign out</div>
            </div>
        </div>
        <div className="leftnav">
            <div><a href="#/">Accounts</a></div>
            <div><a href="#/support">Customer Support</a></div>
        </div>
        <div className="leftnav-underlay"></div>
        <div className="page-content"></div>
      </div>
    );
  }
});
