import {Utils} from "../backend/src/Database/Utils";
import {Data} from "./Data";

export enum SkillType {
    driverSkill = 'driverSkill',
    autoSkill = 'autoSkill'
}

export interface SkillWithTeam {
    skillsTeamNumber: string,
    driverSkill: number[],
    autoSkill: number[]
}

export class Skill {
    data: SkillWithTeam[] = [];
    db: Utils = new Utils();

    _locateTeam(teamNumber: string): SkillWithTeam {
        let data = this.db.getData();
        let foundTeam: SkillWithTeam | null = null;
        data.skills.forEach(team => {
            if (team.skillsTeamNumber === teamNumber) {
                foundTeam = team;
            }
        });
        if (!foundTeam) {
            throw new Error(`Team with number ${teamNumber} not found`);
        }
        return foundTeam;
    }

    setSkillScore(teamNumber: string, skillType: SkillType, score: number) {
        let team = this._locateTeam(teamNumber);
        if (team[skillType].length >= 3) {
            throw new Error(`${skillType} attempts have reached the limit`);
        }

        team[skillType].push(score);
        this._update(team);
        return team;
    }

    getSkill(teamNumber: string): SkillWithTeam {
        return this._locateTeam(teamNumber);
    }

    _update(updatedTeam: SkillWithTeam) {
        let newData: Data = this.db.getData();

        newData.skills.forEach((team, index) => {
            if (team.skillsTeamNumber === updatedTeam.skillsTeamNumber) {
                newData.skills[index] = updatedTeam;
            }
        });

        this.db.updateData(newData);
    }
}