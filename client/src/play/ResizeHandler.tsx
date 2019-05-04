import React from "react";

interface Props {
    onResize: () => void;
}

export class ResizeHandler extends React.Component<Props> {
    componentDidMount() {
        this.props.onResize();
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize = () => {
        this.props.onResize();
    };

    render() {
        return this.props.children;
    }
}
