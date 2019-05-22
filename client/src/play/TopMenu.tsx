import { Button, Classes, Popover } from "@blueprintjs/core";
import { Campaign } from "protocol/lib/Campaign";
import { Message } from "protocol/lib/Messages";
import * as React from "react";
import { SceneMenu } from "./SceneMenu";

interface Props {
    campaign: Campaign;
    onMessage: (message: Message) => void;
}

export class TopMenu extends React.Component<Props> {
    render() {
        return (
            <div className="top-menu">
                <Popover
                    content={<SceneMenu {...this.props} />}
                    minimal
                    position="bottom-left"
                >
                    <Button
                        className={Classes.MINIMAL}
                        icon="mountain"
                        text="Scenes"
                    />
                </Popover>
            </div>
        );
    }
}
