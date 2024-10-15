import {DivisionObject} from "./Division";
import {PeriodObject} from "./Period";
import {MatchWithDivision} from "./Match";
import {SkillWithTeam} from "./Skill";
import {TeamObject} from "./Team";

export interface Data {
    tournamentName: string,
    tournamentPassword: string,
    settings: {
        playerDuration: number,
        division: DivisionObject[],
        fieldSetId: number[],
        eliminationAllianceCount: number
    },
    teams: TeamObject[],
    periods: PeriodObject[],
    matches: MatchWithDivision[],
    skills: SkillWithTeam[]
}

export const DEFAULT_DATA: Data = {
    tournamentName: "",
    tournamentPassword: "",
    settings: {
        playerDuration: 0,
        division: [],
        fieldSetId: [],
        eliminationAllianceCount: 0,
    },
    teams: [],
    periods: [],
    matches: [],
    skills: []
}
