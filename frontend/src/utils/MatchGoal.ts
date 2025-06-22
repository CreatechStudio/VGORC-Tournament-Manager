import {MatchGoals} from "../../../common/Admin.ts";

export interface MatchGoalArrayItem {
    id: string, name: string, points: number
}

export interface ScoreDetail {
    goalId: string,
    count: number
}

export function getNameFromMatchGoalId(matchGoals: MatchGoalArrayItem[] | MatchGoals, id: string): string {
    if (matchGoals instanceof Array) {
        matchGoals = array2MatchGoals(matchGoals);
    }
    if (matchGoals[id] === undefined) {
        return "";
    }
    return matchGoals[id].name;
}

export function getPointsFromMatchGoalId(matchGoals: MatchGoalArrayItem[] | MatchGoals, id: string): number {
    if (matchGoals instanceof Array) {
        matchGoals = array2MatchGoals(matchGoals);
    }
    if (matchGoals[id] === undefined) {
        return 0;
    }
    return matchGoals[id].points;
}

export function getCountFromMatchGoalId(scoreDetails: ScoreDetail[], id: string): number {
    return scoreDetails.find((detail) => detail.goalId === id)?.count ?? 0;
}

export function matchGoals2Array(matchGoals: MatchGoals): MatchGoalArrayItem[] {
    const result: MatchGoalArrayItem[] = [];
    Object.keys(matchGoals).forEach(key => {
        result.push({
            id: key,
            name: matchGoals[key].name,
            points: matchGoals[key].points
        });
    });
    return result;
}

export function array2MatchGoals(arr: MatchGoalArrayItem[]): MatchGoals {
    const matchGoals: MatchGoals = {};
    arr.forEach((goal) => {
        matchGoals[goal.id] = {
            name: goal.name,
            points: goal.points
        };
    });
    return matchGoals;
}

export function scoreDetails2Array(scoreDetails: {[goalKey: string]: number}): ScoreDetail[] {
    const result: ScoreDetail[] = [];
    Object.keys(scoreDetails).forEach((key) => {
        result.push({
            goalId: key,
            count: scoreDetails[key]
        });
    });
    return result;
}

export function array2ScoreDetails(arr: ScoreDetail[]): {[goalKey: string]: number} {
    const scoreDetails: {[goalKey: string]: number} = {};
    arr.forEach((detail) => {
        scoreDetails[detail.goalId] = detail.count;
    });
    return scoreDetails;
}
