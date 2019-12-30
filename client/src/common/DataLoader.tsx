import React from "react";

interface Props<T> {
    load: () => Promise<T>;
    children: (data: T) => React.ReactNode;
}

interface State<T> {
    data: T | null;
}

export class DataLoader<T> extends React.Component<Props<T>, State<T>> {
    state: State<T> = {
        data: null
    };

    async componentDidMount() {
        this.setState({ data: await this.props.load() });
    }

    render() {
        if (this.state.data == null) {
            return "<Spinner />";
        }
        return this.props.children(this.state.data);
    }
}
