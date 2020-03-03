import { EntityManager } from "./EntityManager";
import { AddEntity } from "./gamestate/events/AddEntity";
import { DeleteEntity } from "./gamestate/events/DeleteEntity";
import { UpdateEntity } from "./gamestate/events/UpdateEntity";

describe("EntityManager", () => {
    it("should apply remote updates", () => {
        const dispatch = jest.fn();
        const manager = new EntityManager("session", "campaign", dispatch);
        manager.applyRemoteUpdate({
            type: "create",
            source: "",
            entity: {
                attributes: [],
                campaignID: "campaign",
                entityID: "eid",
                type: "foo",
                version: 0
            }
        });
        manager.applyRemoteUpdate({
            type: "update-attribute",
            source: "",
            attribute: { attributeID: "foo", stringValue: "bar" },
            campaignID: "campaign",
            entityID: "eid"
        });

        manager.applyRemoteUpdate({
            type: "delete",
            source: "",
            entityID: "eid",
            campaignID: "campaign"
        });

        expect(dispatch).toHaveBeenCalledWith(
            new AddEntity({
                attributes: [],
                campaignID: "campaign",
                entityID: "eid",
                type: "foo",
                version: 0
            })
        );
        expect(dispatch).toHaveBeenCalledWith(
            new UpdateEntity({
                attributes: [{ attributeID: "foo", stringValue: "bar" }],
                campaignID: "campaign",
                entityID: "eid",
                type: "foo",
                version: 0
            })
        );
        expect(dispatch).toHaveBeenCalledWith(new DeleteEntity("eid"));
    });

    it("should not duplicate creates or updates", () => {
        const dispatch = jest.fn();
        const manager = new EntityManager("session", "campaign", dispatch);
        manager.applyRemoteUpdate({
            type: "create",
            source: "session",
            entity: {
                attributes: [],
                campaignID: "campaign",
                entityID: "eid",
                type: "foo",
                version: 0
            }
        });
        manager.applyRemoteUpdate({
            type: "delete",
            source: "session",
            entityID: "eid",
            campaignID: "campaign"
        });

        expect(dispatch).not.toHaveBeenCalled();
    });
});
