import { Button, Classes, Popover } from "@blueprintjs/core";
import { Campaign } from "protocol/lib/Campaign";
import { newId } from "protocol/lib/Id";
import { Message } from "protocol/lib/Messages";
import { Scene } from "protocol/lib/Scene";
import * as React from "react";

interface Props {
    campaign: Campaign;
    onMessage: (message: Message) => void;
}

export class TopMenu extends React.Component<Props> {
    addScene = () => {
        this.props.onMessage({
            type: "update-scene",
            id: newId(),
            scene: {
                id: newId(),
                name: "New Scene",
                tokens: []
            }
        });
    };

    toScene = (scene: Scene) => {
        this.props.onMessage({
            type: "update-campaign",
            id: newId(),
            campaign: {
                ...this.props.campaign
            }
        });
    };

    renderScenes() {
        return (
            <div className="scene-menu">
                {this.props.campaign.scenes.map(s => (
                    <div key={s.id}>
                        <Button className={Classes.MINIMAL} icon="flag" />{" "}
                        {s.name}
                    </div>
                ))}
                <Button
                    className={Classes.MINIMAL}
                    text="Add Scene"
                    onClick={this.addScene}
                />
            </div>
        );
    }

    render() {
        return (
            <div className="top-menu">
                <Popover
                    content={this.renderScenes()}
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
