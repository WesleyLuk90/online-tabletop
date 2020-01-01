import { Campaign } from "protocol/src/Campaign";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Routes } from "../app/Routes";
import { ConfirmButton } from "../common/Button";
import { Form } from "../common/Form";
import { Spinner } from "../common/Icon";
import { Input } from "../common/Input";
import { Page } from "../common/Page";
import { CampaignRequests } from "./CampaignRequests";

export function EditCampaignPage() {
    const { id } = useParams();

    const [original, setOriginal] = useState<Campaign | null>(null);
    const [edits, setEdits] = useState<Campaign | null>(null);
    const history = useHistory();

    useEffect(() => {
        if (!id) {
            setOriginal({ id: "", ownerID: "", name: "", players: [] });
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
                <Input
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
