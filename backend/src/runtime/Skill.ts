import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {SkillType, SkillWithTeam} from "../../../common/Skill";

export class Skill {
    data: SkillWithTeam[] = [];
    db: Utils = new Utils();

    _indexOf(teamNumber: string): number {
        this.data = this.db.getData().skills || [];
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].skillsTeamNumber === teamNumber) {
                return i;
            }
        }
        return -1;
    }



    setSkillScore(teamNumber: string, skillType: SkillType, scores: number[]) {
        let index = this._indexOf(teamNumber);
        if (index !== -1) {
            let team = this.data[index];
            team[skillType] = scores;
            this._update();
        } else {
            let newTeam: SkillWithTeam = {
                skillsTeamNumber: teamNumber,
                driverSkill: skillType === SkillType.driverSkill ? scores : [],
                autoSkill: skillType === SkillType.autoSkill ? scores : []
            };
            this.data.push(newTeam);
            this._update();
        }
    }

    getSkill(teamNumber: string): SkillWithTeam {
        let index = this._indexOf(teamNumber);
        if (index === -1) {
            return {
                skillsTeamNumber: teamNumber,
                driverSkill: [],
                autoSkill: []
            }
        }
        return this.data[index];
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.skills = this.data;
        this.db.updateData(newData);
    }
}
