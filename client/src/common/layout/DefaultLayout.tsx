import React from "react";
import "./DefaultLayout.css";

export class DefaultLayout extends React.Component {
    render() {
        return <div className="default-layout">{this.props.children}</div>;
    }
}
