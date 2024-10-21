import {DivisionObject} from "../../common/Division.ts";
import {TeamObject} from "../../common/Team.ts";
import {FieldSetObject} from "../../common/FieldSet.ts";

export const ASPECT_RATIO = 1/0.618;
export const SMALL_PART = 38.2;
export const LARGE_PART = 61.8;

export const PAD = 1.618;
export const PAD2 = PAD * 2;
export const PAD3 = PAD * 3;
export const PAD4 = PAD * 4;
export const PAD5 = PAD * 5;

export const PAD1_5 = PAD * 1.5;


export const DEFAULT_DIVISION: DivisionObject = {
    divisionName: "",
    divisionFields: []
}

export const DEFAULT_TEAM: TeamObject = {
    teamNumber: "",
    teamName: "",
    teamOrganization: "",
    teamDivision: ""
}

export const DEFAULT_FIELD_SET: FieldSetObject = {
    fieldSetId: 0,
    fields: []
}


export interface PictureObject {
    url: string;
    name: string;
}

export const PICTURES: PictureObject[] = [
    {
        url: import.meta.env.VITE_VENDOR_LOGO,
        name: "Vendor Logo"
    },
    {
        url: "/CreatechStudio.png",
        name: "CreatechStudio"
    },
    {
        url: "/VEX GO Logo_Full Color.png",
        name: "VEX GO"
    }
];

export const SCROLL_SPEED = .25;
