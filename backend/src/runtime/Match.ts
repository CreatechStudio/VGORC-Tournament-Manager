import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {MatchObject, MatchWithDivision} from "../../../common/Match";

export class Match {
    data: MatchWithDivision[] = [];
    db: Utils = new Utils();

    _locateMatch(divisionName: string, matchNumber: number): MatchObject {
        let data = this.db.getData();
        let decodedDivisionName = decodeURIComponent(divisionName);
        let foundMatch: MatchObject | null = null;
        data.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach(match => {
                    if (match.matchNumber === matchNumber) {
                        foundMatch = match;
                    }
                });
            }
        });
        if (!foundMatch) {
            throw `Match with number ${matchNumber} not found in division ${decodedDivisionName}`;
        }
        return foundMatch;
    }

    setScore(divisionName: string, matchNumber: number, score: number) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let currentMatch = this._locateMatch(decodedDivisionName, matchNumber);
        currentMatch.matchScore = score;
        currentMatch.hasScore = true;

        this.data.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach((match, matchIndex) => {
                    if (match.matchNumber === matchNumber) {
                        division.matches[matchIndex] = currentMatch;
                    }
                });
            }
        });

        this._update(divisionName, currentMatch);
        return currentMatch;
    }

    getAllMatches(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let data = this.db.getData();
        let foundMatches: MatchObject[] = [];
        data.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                foundMatches = division.matches;
            }
        });
        return foundMatches
    }

    getMatch(divisionName: string, matchNumber: number) {
        return this._locateMatch(divisionName, matchNumber);
    }

    _update(divisionName: string, currentMatch: MatchObject) {
        let newData: Data = this.db.getData();
        let decodedDivisionName = decodeURIComponent(divisionName);

        newData.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach((match, matchIndex) => {
                    if (match.matchNumber === currentMatch.matchNumber) {
                        division.matches[matchIndex] = currentMatch;
                    }
                });
            }
        });

        this.db.updateData(newData);
    }
}
