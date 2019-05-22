import { Button, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { fromNullable } from "fp-ts/lib/Option";
import { Scene } from "protocol/lib/Scene";
import * as React from "react";

interface Props {
    scene: Scene | null;
    onChange: (scene: Scene) => void;
    onSave: () => void;
    onCancel: () => void;
}

export class SceneForm extends React.Component<Props> {
    render() {
        return (
            <Dialog isOpen={this.props.scene != null}>
                {fromNullable(this.props.scene)
                    .map<JSX.Element | null>(scene => (
                        <div>
                            <FormGroup label="Name" labelFor="scene-name">
                                <InputGroup
                                    id="text-input"
                                    placeholder="Name"
                                    value={scene.name}
                                    onChange={(
                                        i: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        this.props.onChange({
                                            ...scene,
                                            name: i.target.value
                                        })
                                    }
                                />
                            </FormGroup>
                            <Button
                                text="Cancel"
                                onClick={this.props.onCancel}
                            />
                            <Button text="Save" onClick={this.props.onSave} />
                        </div>
                    ))
                    .getOrElse(null)}
            </Dialog>
        );
    }
}
