export interface MatchObject {
    matchNumber: number;
    matchType: string;
    matchField: string;
    matchFieldSet: number;
    matchPeriod: number;
    matchCountInPeriod: number;
    matchStartTime: string;
    matchTeam: string[];
    hasScore: boolean;
    matchScore: number;
    matchScoreHistory: number[];
    scoreDetails: {
        [goalKey: string]: number;
    };
    isAdditional?: boolean;
}

export interface MatchWithDivision {
    divisionName: string,
    matches: MatchObject[],
}

export const DEFAULT_MATCH_OBJECT: MatchObject = {
    matchNumber: 0,
    matchType: "",
    matchField: "",
    matchFieldSet: 0,
    matchPeriod: 0,
    matchCountInPeriod: 0,
    matchStartTime: "",
    matchTeam: [],
    hasScore: false,
    matchScore: 0,
    matchScoreHistory: [],
    scoreDetails: {},
}