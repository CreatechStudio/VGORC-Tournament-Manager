export interface MatchObject {
    matchNumber: number,
    matchType: string,
    matchField: string,
    matchFieldSet: number,
    matchPeriod: number,
    matchCountInPeriod: number,
    matchTeam: string[],
    matchScore: 0
}

export interface MatchWithDivision {
    divisionName: string,
    matches: MatchObject[],
}
