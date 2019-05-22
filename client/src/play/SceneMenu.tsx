import { Button, Classes } from "@blueprintjs/core";
import { Campaign } from "protocol/lib/Campaign";
import { newId } from "protocol/lib/Id";
import { Message } from "protocol/lib/Messages";
import { Scene } from "protocol/lib/Scene";
import * as React from "react";
import { SceneForm } from "./SceneForm";

interface Props {
    campaign: Campaign;
    onMessage: (message: Message) => void;
}

interface State {
    edit: Scene | null;
}

export class SceneMenu extends React.Component<Props, State> {
    state: State = {
        edit: null
    };

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

    updateScene = () => {
        if (this.state.edit == null) {
            return;
        }
        this.props.onMessage({
            type: "update-scene",
            id: newId(),
            scene: {
                ...this.state.edit,
                tokens: []
            }
        });
        this.setState({ edit: null });
    };

    render() {
        return (
            <div className="scene-menu">
                {this.props.campaign.scenes.map(s => (
                    <div key={s.id} className="scene-menu__scene-option">
                        <Button className={Classes.MINIMAL} icon="flag" />
                        <div className="scene-menu__scene-name">{s.name}</div>
                        <Button
                            className={Classes.MINIMAL}
                            icon="edit"
                            onClick={() => this.setState({ edit: s })}
                        />
                    </div>
                ))}
                <Button
                    className={Classes.MINIMAL}
                    text="Add Scene"
                    onClick={this.addScene}
                />
                <SceneForm
                    scene={this.state.edit}
                    onChange={s => this.setState({ edit: s })}
                    onSave={this.updateScene}
                    onCancel={() => this.setState({ edit: null })}
                />
            </div>
        );
    }
}
