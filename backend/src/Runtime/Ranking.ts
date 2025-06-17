import {Utils} from "../Utils";
import {MatchObject, MatchWithDivision} from "../../../common/Match";
import {TeamObject} from "../../../common/Team";

export class Ranking {
    db: Utils = new Utils();

    _findTeamMatches(teamNumber: string, divisionName: string, matchType: string): MatchObject[] {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let data = this.db.getData();
        let allMatches: MatchWithDivision[] = data.matches;
        allMatches = allMatches.filter(match => match.divisionName === decodedDivisionName);
        let allMatchesInDivision: MatchObject[] = allMatches[0].matches;
        let matches: MatchObject[] = []

        if (matchType === 'Qualification') {
            allMatchesInDivision.forEach(match => {
                if (match.matchTeam.includes(teamNumber) && match.matchType === 'Qualification') {
                    matches.push(match);
                }
            });
        } else if (matchType === 'Elimination') {
            allMatchesInDivision.forEach(match => {
                if (match.matchTeam.includes(teamNumber) && match.matchType === 'Elimination') {
                    matches.push(match);
                }
            });
        } else {
            throw ('Invalid match type');
        }
        return matches;
    }

    _findTeamScoredMatchesInQualification(teamNumber: string, divisionName: string): MatchObject[] {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let allMatches: MatchObject[] = this._findTeamMatches(teamNumber, decodedDivisionName, 'Qualification');
        return allMatches.filter(match => match.hasScore);
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
        let matches = this._findTeamMatches(teamNumber, decodedDivisionName, 'Qualification');
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
        return Math.round((totalScore / validMatchesCount) * 100) / 100;
    }

    getQualRanking(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let teams = this._findTeamsInDivision(decodedDivisionName);
        let ranking: { teamNumber: string; teamMatchCount: number; teamAvgScore: number; }[] = [];

        teams.forEach(team => {
            let avgScore = this._calcAvgScoreOfTeamInDivision(team.teamNumber, decodedDivisionName);
            let teamScoredMatchCount = this._findTeamScoredMatchesInQualification(team.teamNumber, decodedDivisionName).length;
            ranking.push({
                teamNumber: team.teamNumber,
                teamMatchCount: teamScoredMatchCount,
                teamAvgScore: avgScore
            });
        });

        ranking.sort((a, b) => b.teamAvgScore - a.teamAvgScore);
        return ranking;
    }

    getSkillRanking() {
        const data = this.db.getData();
        const ranking: {
            teamNumber: string;
            DriverScore: number;
            AutoScore: number;
            TotalScore: number;
        }[] = [];

        data.skills.forEach(team => {
            const driverScore = team.driverSkill.length > 0 ? Math.max(...team.driverSkill) : 0;
            const autoScore = team.autoSkill.length > 0 ? Math.max(...team.autoSkill) : 0;
            const totalScore = driverScore + autoScore;

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

    getElimRanking(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let data = this.db.getData();
        let allMatchesInDivision: MatchWithDivision[] = data.matches;
        allMatchesInDivision = allMatchesInDivision.filter(match => match.divisionName === decodedDivisionName);
        let eliminationMatches: MatchObject[] = [];
        allMatchesInDivision[0].matches.forEach(match => {
            if (match.matchType === 'Elimination') {
                eliminationMatches.push(match);
            }
        })
        let ranking: { rank: number, teams: string[], score:number }[] = [];
        eliminationMatches = eliminationMatches.filter(match => match.hasScore);
        eliminationMatches.sort((a, b) => b.matchScore - a.matchScore);
        eliminationMatches.forEach(match => {
            ranking.push({
                rank: 0,
                teams: match.matchTeam,
                score: match.matchScore
            });
        });
        ranking.forEach((rank, index) => {
            if (index === 0) {
                rank.rank = 1;
            } else {
                if (rank.score === ranking[index - 1].score) {
                    rank.rank = ranking[index - 1].rank;
                } else {
                    rank.rank = index + 1;
                }
            }
        })
        return ranking;
    }
}
