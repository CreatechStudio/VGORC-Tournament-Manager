export interface SkillObject {
    attempt: number,
    score: number
}

export interface SkillWithTeam {
    skillsTeamNumber: string,
    driverSkill: SkillObject[],
    autoSkill: SkillObject[]
}
