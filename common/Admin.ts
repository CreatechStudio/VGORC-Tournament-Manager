export interface AdminObject {
    playerDuration: number,
    eliminationAllianceCount: number
    matchGoals: {
        [key: string]: MatchGoal
    }
}

export interface MatchGoal {
    name: string,
    points: number
}