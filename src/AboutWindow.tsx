import React from "react";

class AboutWindow extends React.Component {
  render() {
    return (
      <div className="AboutWindow">
        <h1>About</h1>
        <button onClick={this.props.onClose}>Close</button>
      </div>
    );
  }
}

export default AboutWindow;
