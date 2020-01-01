import { Campaign } from "protocol/src/Campaign";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
    const [editedCampaign, setCampaign] = useState<Campaign | null>(null);

    return data(originalCampaign => {
        const isNew = originalCampaign.id === "";
        const campaign = editedCampaign || originalCampaign;

        async function onSave() {
            if (isNew) {
                await CampaignRequests.create(campaign);
            } else {
                await CampaignRequests.update(campaign);
            }
        }

        return (
            <Page title={isNew ? "Create Campaign" : "Edit Campaign"}>
                <Form onSave={onSave}>
                    <Input
                        value={campaign.name}
                        label="Name"
                        onChange={name => setCampaign({ ...campaign, name })}
                    />
                </Form>
            </Page>
        );
    });
}
