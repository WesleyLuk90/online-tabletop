import { Campaign } from "protocol/src/Campaign";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form } from "../common/Form";
import { Spinner } from "../common/Icon";
import { Input } from "../common/Input";
import { Page } from "../common/Page";
import { checkNotNull } from "../util/Nullable";
import { CampaignRequests } from "./CampaignRequests";

export function EditCampaignPage() {
    const { id } = useParams();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        if (!id) {
            setCampaign({ id: "", ownerID: "", name: "", players: [] });
        } else {
            CampaignRequests.get(id).then(setCampaign);
        }
    }, [id]);

    if (campaign == null) {
        return <Spinner />;
    }

    const isNew = campaign.id === "";

    async function onSave() {
        await CampaignRequests.create(checkNotNull(campaign));
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
}
