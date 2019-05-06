import { Button } from "@blueprintjs/core";
import React from "react";
import { Factory } from "./Factory";
import { Message } from "./protocol/Messages";

interface Props {
    sceneId: string;
    onMessage: (message: Message) => void;
}

export class SideBar extends React.Component<Props> {
    addToken = () => {
        this.props.onMessage(Factory.createToken(this.props.sceneId));
    };

    render() {
        return (
            <div>
                <Button onClick={this.addToken}>Add Token</Button>
            </div>
        );
    }
}
