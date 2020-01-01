import { Campaign } from "protocol/src/Campaign";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Routes } from "../app/Routes";
import { Form } from "../common/Form";
import { Input } from "../common/Input";
import { Page } from "../common/Page";
import { useAsyncData } from "../util/AsyncData";
import { CampaignRequests } from "./CampaignRequests";

export function EditCampaignPage() {
    const { id } = useParams();

    const data = useAsyncData(async () => {
        if (!id) {
            return { id: "", ownerID: "", name: "", players: [] };
        } else {
            return CampaignRequests.get(id);
        }
    });
    const [edits, setEdits] = useState<Campaign | null>(null);
    const history = useHistory();

    return data(originalCampaign => {
        const isNew = originalCampaign.id === "";
        const campaign = edits || originalCampaign;

        async function onSave() {
            if (isNew) {
                const created = await CampaignRequests.create(campaign);
                history.push(Routes.editCampaign(created.id));
            } else {
                await CampaignRequests.update(campaign);
                setEdits(null);
            }
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
            </Page>
        );
    });
}
