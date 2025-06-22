import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {SkillType, SkillWithTeam} from "../../../common/Skill";
import {DivisionObject} from "../../../common/Division";
import {Admin} from "./Admin";

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

    getAllSkillFields(): string[] {
        let fields: string[] = [];
        let allDivision: DivisionObject[] = this.db.getData().settings.division;
        let skillDivisions: DivisionObject[] = []
        allDivision.forEach(division => {
            if (division.isSkill) {
                skillDivisions.push(division);
            }
        });
        if (skillDivisions.length > 1) {
            throw "There should be only one skill division";
        } else {
            skillDivisions.forEach(division => {
                fields.push(...division.divisionFields);
            })
        }
        return fields
    }

    setSkillScore(
        teamNumber: string,
        skillType: string,
        scoreDetails: Record<string, number>[]
    ) {
        let actualSkillType: SkillType;
        if (skillType === 'driverSkill' || skillType === 'driverSkillDetails') {
            actualSkillType = SkillType.driverSkill;
        } else if (skillType === 'autoSkill' || skillType === 'autoSkillDetails') {
            actualSkillType = SkillType.autoSkill;
        } else {
            throw "Skill type is required and must be one of: driverSkill, autoSkill, driverSkillDetails, autoSkillDetails";
        }

        const admin = new Admin();
        const matchGoals = admin.get().matchGoals;

        const scores = scoreDetails.map(details => {
            let score = 0;
            for (const [key, count] of Object.entries(details)) {
                const goal = matchGoals[key];
                if (!goal) {
                    throw `Invalid matchGoal key: ${key}`;
                }
                score += goal.points * count;
            }
            return score;
        });

        const index = this._indexOf(teamNumber);

        if (index !== -1) {
            if (actualSkillType === SkillType.driverSkill) {
                this.data[index].driverSkill = scores;
                this.data[index].driverSkillDetails = scoreDetails;
            } else if (actualSkillType === SkillType.autoSkill) {
                this.data[index].autoSkill = scores;
                this.data[index].autoSkillDetails = scoreDetails;
            }
        } else {
            const newTeam: SkillWithTeam = {
                skillsTeamNumber: teamNumber,
                driverSkill: actualSkillType === SkillType.driverSkill ? scores : [],
                autoSkill: actualSkillType === SkillType.autoSkill ? scores : [],
                driverSkillDetails: actualSkillType === SkillType.driverSkill ? scoreDetails : [],
                autoSkillDetails: actualSkillType === SkillType.autoSkill ? scoreDetails : []
            };
            this.data.push(newTeam);
        }

        this._update();
    }

    getSkill(teamNumber: string): SkillWithTeam {
        const index = this._indexOf(teamNumber);
        if (index === -1) {
            return {
                skillsTeamNumber: teamNumber,
                driverSkill: [],
                autoSkill: [],
                driverSkillDetails: [],
                autoSkillDetails: []
            };
        }
        return this.data[index];
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.skills = this.data;
        this.db.updateData(newData);
    }
}
