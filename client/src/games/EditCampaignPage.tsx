import { Campaign } from "protocol/src/Campaign";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Routes } from "../app/Routes";
import { ConfirmButton } from "../common/controls/Button";
import { Form } from "../common/controls/Form";
import { Spinner } from "../common/controls/Icon";
import { TextFormControl } from "../common/controls/TextFormControl";
import { Page } from "../common/layout/Page";
import { CampaignRequests } from "./CampaignRequests";

export function EditCampaignPage() {
    const { id } = useParams();

    const [original, setOriginal] = useState<Campaign | null>(null);
    const [edits, setEdits] = useState<Campaign | null>(null);
    const history = useHistory();

    useEffect(() => {
        if (!id) {
            setOriginal({
                id: "",
                ownerID: "",
                name: "",
                players: [],
                sceneID: ""
            });
        } else {
            CampaignRequests.get(id).then(setOriginal);
        }
    }, [id]);

    if (original == null) {
        return <Spinner />;
    }

    const isNew = original.id === "";
    const campaign = edits || original;

    async function onSave() {
        if (isNew) {
            const created = await CampaignRequests.create(campaign);
            history.push(Routes.editCampaign(created.id));
        } else {
            setOriginal(await CampaignRequests.update(campaign));
            setEdits(null);
        }
    }

    async function doDelete() {
        await CampaignRequests.delete(campaign);
        history.push(Routes.home());
    }

    return (
        <Page title={isNew ? "Create Campaign" : "Edit Campaign"}>
            <Form onSave={onSave}>
                <TextFormControl
                    value={campaign.name}
                    label="Name"
                    onChange={name => setEdits({ ...campaign, name })}
                />
            </Form>
            <ConfirmButton prompt="Delete this campaign?" onClick={doDelete}>
                Delete
            </ConfirmButton>
        </Page>
    );
}
