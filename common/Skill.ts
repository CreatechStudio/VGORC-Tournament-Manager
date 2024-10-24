export enum SkillType {
    driverSkill = 'driverSkill',
    autoSkill = 'autoSkill'
}

export interface SkillWithTeam {
    skillsTeamNumber: string,
    driverSkill: number[],
    autoSkill: number[]
}
