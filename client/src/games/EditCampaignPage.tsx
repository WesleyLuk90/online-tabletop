import { Campaign } from "protocol/src/Campaign";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form } from "../common/Form";
import { Spinner } from "../common/Icon";
import { Input } from "../common/Input";
import { CampaignRequests } from "./CampaignRequests";

export function EditCampaignPage() {
    const { id } = useParams();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
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

    async function onSave() {}

    return (
        <div>
            <Form onSave={onSave}>
                <Input
                    value={campaign.name}
                    label="Name"
                    onChange={name => setCampaign({ ...campaign, name })}
                />
            </Form>
        </div>
    );
}
