import {DivisionObject} from "./Division";
import {PeriodObject} from "./Period";
import {MatchWithDivision} from "./Match";
import {SkillWithTeam} from "./Skill";
import {TeamObject} from "./Team";
import {AuthObject} from "./Auth";
import {FieldSetObject} from "./FieldSet";
import {AdminObject} from "./Admin";

export interface Data {
    tournamentName: string,
    locked: boolean,
    auth: AuthObject[],
    settings: {
        adminData: AdminObject,
        division: DivisionObject[],
        fieldSets: FieldSetObject[],
    },
    teams: TeamObject[],
    periods: PeriodObject[],
    matches: MatchWithDivision[],
    skills: SkillWithTeam[]
}

export const DEFAULT_DATA: Data = {
    tournamentName: "",
    locked: false,
    auth: [],
    settings: {
        adminData: {playerDuration: 0, eliminationAllianceCount: 0},
        division: [],
        fieldSets: [],
    },
    teams: [],
    periods: [],
    matches: [],
    skills: []
}
