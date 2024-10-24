export interface MatchObject {
    matchNumber: number,
    matchType: string,
    matchField: string,
    matchFieldSet: number,
    matchPeriod: number,
    matchCountInPeriod: number,
    matchTeam: string[],
    hasScore: boolean,
    matchScore: number
}

export interface MatchWithDivision {
    divisionName: string,
    matches: MatchObject[],
}
