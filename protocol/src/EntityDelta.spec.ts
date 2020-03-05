import { Entity, NumberAttribute, SubEntityAttribute } from "./Entity";
import { applyDelta } from "./EntityDelta";

describe("Entity Delta", () => {
    const campaignID = "c";
    const entityID = "e";
    const source = "s";
    const subEntityAttribute: SubEntityAttribute = {
        attributeID: "sub",
        entities: []
    };
    const numberAttribute: NumberAttribute = {
        attributeID: "number",
        numberValue: 3
    };
    const entity: Entity = {
        attributes: [numberAttribute, subEntityAttribute],
        entityID,
        campaignID,
        type: "type",
        version: 1
    };
    it("should update attributes", () => {
        expect(
            applyDelta(entity, {
                type: "update-attribute",
                attribute: {
                    attributeID: "number",
                    numberValue: 4
                },
                entityID,
                campaignID,
                source
            })
        ).toEqual({
            ...entity,
            attributes: [
                subEntityAttribute,
                {
                    attributeID: "number",
                    numberValue: 4
                }
            ]
        });
    });
    it("should delete attributes", () => {
        expect(
            applyDelta(entity, {
                type: "delete-attribute",
                attributeID: "number",
                entityID,
                campaignID,
                source
            })
        ).toEqual({
            ...entity,
            attributes: [subEntityAttribute]
        });
    });
    it("should create subentities", () => {
        expect(
            applyDelta(entity, {
                type: "create-subentity-attribute",
                path: [
                    {
                        attributeID: "sub",
                        subEntityID: "e1"
                    }
                ],
                subEntity: {
                    entityID: "e1",
                    attributes: [],
                    type: "type2"
                },
                entityID,
                campaignID,
                source
            })
        ).toEqual({
            ...entity,
            attributes: [
                {
                    attributeID: "sub",
                    subEntities: [
                        {
                            entityID: "e1",
                            attributes: [],
                            type: "type2"
                        }
                    ]
                }
            ]
        });
    });
});
