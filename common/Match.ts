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
}

export interface MatchWithDivision {
    divisionName: string,
    matches: MatchObject[],
}
