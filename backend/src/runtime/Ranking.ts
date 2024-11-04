import {Utils} from "../Utils";
import {MatchObject} from "../../../common/Match";
import {TeamObject} from "../../../common/Team";

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

    _calcAvgScoreOfTeamInDivision(teamNumber: string, divisionName: string): number {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let matches = this._findTeamMatches(teamNumber, decodedDivisionName);
        let totalMatches = matches.length;
        if (totalMatches === 0) return 0;

        let excludeCount = 0;
        if (totalMatches >= 4 && totalMatches <= 7) {
            excludeCount = 1;
        } else if (totalMatches >= 8 && totalMatches <= 11) {
            excludeCount = 2;
        } else if (totalMatches >= 12 && totalMatches <= 15) {
            excludeCount = 3;
        } else if (totalMatches >= 16) {
            excludeCount = 4;
        }

        matches.sort((a, b) => a.matchScore - b.matchScore);

        let validMatches = matches.slice(excludeCount);
        let totalScore = 0;
        let validMatchesCount = 0;

        validMatches.forEach(match => {
            if (match.hasScore) {
                totalScore += match.matchScore;
                validMatchesCount++;
            }
        });

        if (validMatchesCount === 0) return 0;
        return Math.round((totalScore / validMatchesCount) * 10) / 10;
    }

    getQualRanking(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let teams = this._findTeamsInDivision(decodedDivisionName);
        let ranking: { teamNumber: string; teamAvgScore: number; }[] = [];

        teams.forEach(team => {
            let avgScore = this._calcAvgScoreOfTeamInDivision(team.teamNumber, decodedDivisionName);
            ranking.push({
                teamNumber: team.teamNumber,
                teamAvgScore: avgScore
            });
        });

        ranking.sort((a, b) => b.teamAvgScore - a.teamAvgScore);
        return ranking;
    }

    getSkillRanking() {
        let data = this.db.getData();
        let ranking: { teamNumber: string; DriverScore: number; AutoScore: number; TotalScore: number; }[] = [];

        data.skills.forEach(team => {
            let driverScore = Math.max(...team.driverSkill, 0);
            let autoScore = Math.max(...team.autoSkill, 0);
            let totalScore = driverScore + autoScore;

            ranking.push({
                teamNumber: team.skillsTeamNumber,
                DriverScore: driverScore,
                AutoScore: autoScore,
                TotalScore: totalScore
            });
        });

        ranking.sort((a, b) => b.TotalScore - a.TotalScore);
        return ranking;
    }
}
