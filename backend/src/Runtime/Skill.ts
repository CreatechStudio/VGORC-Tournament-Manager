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
        // Map the input skillType to the actual enum type
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

        let totalScore = 0;

        const lastScoreDetails = scoreDetails[scoreDetails.length - 1];
        for (const [key, count] of Object.entries(lastScoreDetails)) {
            const goal = matchGoals[key];
            if (!goal) {
                throw `Invalid matchGoal key: ${key}`;
            }
            totalScore += goal.points * count;
        }

        const index = this._indexOf(teamNumber);

        if (index !== -1) {
            // Team found, update the existing team
            if (actualSkillType === SkillType.driverSkill) {
                this.data[index].driverSkill = [totalScore];
                this.data[index].driverSkillDetails = scoreDetails;
            } else if (actualSkillType === SkillType.autoSkill) {
                this.data[index].autoSkill = [totalScore];
                this.data[index].autoSkillDetails = scoreDetails;
            }
        } else {
            // Team not found, create a new team and add to the end
            const newTeam: SkillWithTeam = {
                skillsTeamNumber: teamNumber,
                driverSkill: actualSkillType === SkillType.driverSkill ? [totalScore] : [],
                autoSkill: actualSkillType === SkillType.autoSkill ? [totalScore] : [],
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
