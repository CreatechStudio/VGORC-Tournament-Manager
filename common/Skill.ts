export enum SkillType {
    driverSkill = 'driverSkill',
    autoSkill = 'autoSkill',
    driverSkillDetails = 'driverSkillDetails',
    autoSkillDetails = 'autoSkillDetails',
}

export interface SkillWithTeam {
    skillsTeamNumber: string,
    driverSkill: number[],
    autoSkill: number[],
    driverSkillDetails: Record<string, number>[],
    autoSkillDetails: Record<string, number>[],
}
