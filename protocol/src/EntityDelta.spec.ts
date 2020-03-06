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

    function entity(values: Partial<Entity>): Entity {
        return Object.assign(
            {
                attributes: [numberAttribute, subEntityAttribute],
                entityID,
                campaignID,
                type: "type",
                version: 1
            },
            values
        );
    }

    it("should update attributes", () => {
        expect(
            applyDelta(entity({}), {
                type: "update-attribute",
                attribute: {
                    attributeID: "number",
                    numberValue: 4
                },
                path: [],
                entityID,
                campaignID,
                source
            })
        ).toEqual(
            entity({
                attributes: [
                    subEntityAttribute,
                    {
                        attributeID: "number",
                        numberValue: 4
                    }
                ]
            })
        );
    });
    it("should update subentity attributes", () => {
        expect(
            applyDelta(
                entity({
                    attributes: [
                        {
                            attributeID: "sub",
                            entities: [
                                { entityID: "e1", type: "foo", attributes: [] }
                            ]
                        }
                    ]
                }),
                {
                    type: "update-attribute",
                    attribute: {
                        attributeID: "number",
                        numberValue: 4
                    },
                    path: [
                        {
                            attributeID: "sub",
                            subEntityID: "e1"
                        }
                    ],
                    entityID,
                    campaignID,
                    source
                }
            )
        ).toEqual(
            entity({
                attributes: [
                    {
                        attributeID: "sub",
                        entities: [
                            {
                                entityID: "e1",
                                type: "foo",
                                attributes: [
                                    {
                                        attributeID: "number",
                                        numberValue: 4
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        );
    });

    it("should delete attributes", () => {
        expect(
            applyDelta(
                entity({
                    attributes: [
                        {
                            attributeID: "sub",
                            entities: [
                                {
                                    entityID: "e1",
                                    type: "foo",
                                    attributes: [
                                        {
                                            attributeID: "number",
                                            numberValue: 4
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }),
                {
                    type: "delete-attribute",
                    attributeID: "number",
                    path: [{ attributeID: "sub", subEntityID: "e1" }],
                    entityID,
                    campaignID,
                    source
                }
            )
        ).toEqual(
            entity({
                attributes: [
                    {
                        attributeID: "sub",
                        entities: [
                            {
                                entityID: "e1",
                                type: "foo",
                                attributes: []
                            }
                        ]
                    }
                ]
            })
        );
    });
    it("should delete attributes", () => {
        expect(
            applyDelta(entity({}), {
                type: "delete-attribute",
                attributeID: "number",
                path: [],
                entityID,
                campaignID,
                source
            })
        ).toEqual(
            entity({
                attributes: [subEntityAttribute]
            })
        );
    });
    it("should create subentities", () => {
        expect(
            applyDelta(
                entity({
                    attributes: [
                        {
                            attributeID: "sub1",
                            entities: [
                                {
                                    entityID: "e1",
                                    type: "type1",
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }),
                {
                    type: "update-subentity",
                    path: [
                        {
                            attributeID: "sub1",
                            subEntityID: "e1"
                        },
                        {
                            attributeID: "sub2",
                            subEntityID: "e2"
                        }
                    ],
                    subEntity: {
                        entityID: "e2",
                        attributes: [],
                        type: "type2"
                    },
                    entityID,
                    campaignID,
                    source
                }
            )
        ).toEqual(
            entity({
                attributes: [
                    {
                        attributeID: "sub1",
                        entities: [
                            {
                                entityID: "e1",
                                type: "type1",
                                attributes: [
                                    {
                                        attributeID: "sub2",
                                        entities: [
                                            {
                                                entityID: "e2",
                                                type: "type2",
                                                attributes: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        );
    });
    it("should delete subentities", () => {
        expect(
            applyDelta(
                entity({
                    attributes: [
                        {
                            attributeID: "sub1",
                            entities: [
                                {
                                    entityID: "e1",
                                    type: "type1",
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }),
                {
                    type: "delete-subentity",
                    path: [
                        {
                            attributeID: "sub1",
                            subEntityID: "e1"
                        }
                    ],
                    entityID,
                    campaignID,
                    source
                }
            )
        ).toEqual(
            entity({
                attributes: [
                    {
                        attributeID: "sub1",
                        entities: []
                    }
                ]
            })
        );
    });
});
