import {Utils} from "../backend/src/Database/Utils";
import {Data} from "./Data";

export interface MatchObject {
    matchNumber: number,
    matchType: string,
    matchField: string,
    matchFieldSet: number,
    matchPeriod: number,
    matchCountInPeriod: number,
    matchTeam: string[],
    matchScore: number
}

export interface MatchWithDivision {
    divisionName: string,
    matches: MatchObject[],
}

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
            throw new Error(`Match with number ${matchNumber} not found in division ${decodedDivisionName}`);
        }
        return foundMatch;
    }

    setScore(divisionName: string, matchNumber: number, score: number) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let currentMath = this._locateMatch(decodedDivisionName, matchNumber);
        currentMath.matchScore = score;
        this.data.push(
            {
                divisionName: decodedDivisionName,
                matches: [currentMath]
            }
        );
        this._update();
        return currentMath;
    }

    getScore(divisionName: string, matchNumber: number) {
        let match = this._locateMatch(divisionName, matchNumber);
        return match.matchScore;
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.matches = this.data;
        this.db.updateData(newData);
    }
}
