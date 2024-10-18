import {Utils} from "../backend/src/Database/Utils";
import {MatchObject} from "./Match";
import {TeamObject} from "./Team";

export class Ranking {
    db: Utils = new Utils();

    _findTeamMatches(teamNumber: string, divisionName: string): MatchObject[] {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let data = this.db.getData();
        let matches: MatchObject[] = [];

        data.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach(match => {
                    if (match.matchTeam.includes(teamNumber)) {
                        matches.push(match);
                    }
                });
            }
        });

        console.log(matches)
        return matches;
    }

    _findTeamsInDivision(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let data = this.db.getData();
        let teams: TeamObject[] = [];

        data.teams.forEach(team => {
            if (team.teamDivision === decodedDivisionName) {
                teams.push(team);
            }
        });
        return teams;
    }

    _calculateAvgScoreOfTeamInDivision(teamNumber: string, divisionName: string): number {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let matches = this._findTeamMatches(teamNumber, decodedDivisionName);
        if (matches.length === 0) return 0;

        let totalScore = 0;
        matches.forEach(match => {
            totalScore += match.matchScore;
            console.log(teamNumber, match.matchNumber, match.matchScore, totalScore)
        });
        return totalScore / matches.length;
    }

    getRanking(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let teams = this._findTeamsInDivision(decodedDivisionName);
        let ranking: { teamNumber: string; teamAvgScore: number; }[] = [];

        teams.forEach(team => {
            let avgScore = this._calculateAvgScoreOfTeamInDivision(team.teamNumber, decodedDivisionName);
            ranking.push({
                teamNumber: team.teamNumber,
                teamAvgScore: avgScore
            });
        });

        ranking.sort((a, b) => b.teamAvgScore - a.teamAvgScore);

        return ranking;
    }
}