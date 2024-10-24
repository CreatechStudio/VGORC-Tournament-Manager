import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {SkillType, SkillWithTeam} from "../../../common/Skill";

export class Skill {
    data: SkillWithTeam[] = [];
    db: Utils = new Utils();

    constructor() {
        this.data = this.db.getData().skills || [];
    }

    _indexOf(teamNumber: string): number {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].skillsTeamNumber === teamNumber) {
                return i;
            }
        }
        return -1;
    }

    setSkillScore(teamNumber: string, skillType: SkillType, score: number) {
        let index = this._indexOf(teamNumber);
        if (index !== -1) {
            let team = this.data[index];
            if (team[skillType].length >= 3) {
                throw new Error(`${skillType} attempts have reached the limit`);
            }
            team[skillType].push(score);
            this._update();
        } else {
            let newTeam: SkillWithTeam = {
                skillsTeamNumber: teamNumber,
                driverSkill: skillType === SkillType.driverSkill ? [score] : [],
                autoSkill: skillType === SkillType.autoSkill ? [score] : []
            };
            this.data.push(newTeam);
            this._update();
        }
    }

    getSkill(teamNumber: string): SkillWithTeam {
        let index = this._indexOf(teamNumber);
        if (index === -1) {
            throw new Error(`Team with number ${teamNumber} not found`);
        }
        return this.data[index];
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.skills = this.data;
        this.db.updateData(newData);
    }
}
