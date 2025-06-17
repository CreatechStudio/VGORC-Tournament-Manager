export interface AdminObject {
    playerDuration: number,
    eliminationAllianceCount: number
    matchGoals: {
        [key: string]: {
            name: string,
            points: number
        }
    }
}
