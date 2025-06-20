export interface AdminObject {
    playerDuration: number,
    eliminationAllianceCount: number
    matchGoals: MatchGoals
}

export interface MatchGoals {
    [key: string]: MatchGoal
}

export interface MatchGoal {
    name: string,
    points: number
}
