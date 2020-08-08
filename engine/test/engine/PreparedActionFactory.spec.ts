import {
    ActionReference,
    EntityReference,
    SubEntityReference,
} from "../../src/engine/models/Reference";
import { PreparedActionFactory } from "../../src/engine/PreparedActionFactory";
import { Character, Dagger, TestCampaign } from "../TestCampaign";

describe("PreparedActionFactory", () => {
    PreparedActionFactory.createChecked(
        new ActionReference(
            new EntityReference(Character.id, [
                new SubEntityReference("inventory", Dagger.id),
            ]),
            "melee_attack"
        ),
        TestCampaign
    );
});
