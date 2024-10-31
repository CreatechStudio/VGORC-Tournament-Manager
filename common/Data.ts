import {DivisionObject} from "./Division";
import {PeriodObject} from "./Period";
import {MatchWithDivision} from "./Match";
import {SkillWithTeam} from "./Skill";
import {TeamObject} from "./Team";
import {AuthObject} from "./Auth";
import {FieldSetObject} from "./FieldSet";

export interface Data {
    tournamentName: string,
    auth: AuthObject[],
    settings: {
        playerDuration: number,
        division: DivisionObject[],
        fieldSets: FieldSetObject[],
        eliminationAllianceCount: number
    },
    teams: TeamObject[],
    periods: PeriodObject[],
    matches: MatchWithDivision[],
    skills: SkillWithTeam[]
}

export const DEFAULT_DATA: Data = {
    tournamentName: "",
    auth: [],
    settings: {
        playerDuration: 0,
        division: [],
        fieldSets: [],
        eliminationAllianceCount: 0,
    },
    teams: [],
    periods: [],
    matches: [],
    skills: []
}
