export type Skill = {
  id: string;
  name: string;
  proficiency?: number; // 0-100 for student
  required_level?: number; // 0-100 for opportunity
}

export type StudentProfile = {
  skills: Skill[];
  career_interest?: string;
  experience_months?: number;
  location_preference?: string;
}

export type Opportunity = {
  id: string;
  title: string;
  skills: Skill[];
  type?: string;
  required_experience_months?: number;
  location?: string;
  remote?: boolean;
}

/**
 * Calculates a deterministic match score between a student and an opportunity.
 * Scoring algorithm:
 * - 50% Skill compatibility
 * - 20% Eligibility
 * - 15% Career interest
 * - 10% Experience
 * - 5% Location preference
 */
export function calculateMatchScore(student: StudentProfile, opportunity: Opportunity): number {
  let score = 0;

  // 1. Skill Compatibility (50%)
  let skillScore = 0;
  if (opportunity.skills.length > 0) {
    let matchedSkills = 0;
    opportunity.skills.forEach(reqSkill => {
      const studentSkill = student.skills.find(s => s.name.toLowerCase() === reqSkill.name.toLowerCase());
      if (studentSkill && (studentSkill.proficiency || 0) >= (reqSkill.required_level || 0)) {
        matchedSkills++;
      } else if (studentSkill && (studentSkill.proficiency || 0) >= ((reqSkill.required_level || 50) - 20)) {
        // Partial match if they are close
        matchedSkills += 0.5;
      }
    });
    skillScore = (matchedSkills / opportunity.skills.length) * 50;
  } else {
    skillScore = 50; // Full points if no specific skills required
  }
  score += skillScore;

  // 2. Eligibility (20%) - simplified for MVP
  score += 20; 

  // 3. Career Interest (15%)
  if (student.career_interest && opportunity.title.toLowerCase().includes(student.career_interest.toLowerCase())) {
    score += 15;
  } else {
    score += 7.5; // Partial match as default
  }

  // 4. Experience (10%)
  const reqExp = opportunity.required_experience_months || 0;
  const studExp = student.experience_months || 0;
  if (studExp >= reqExp) {
    score += 10;
  } else if (reqExp > 0) {
    score += (studExp / reqExp) * 10;
  }

  // 5. Location (5%)
  if (opportunity.remote) {
    score += 5;
  } else if (student.location_preference && opportunity.location && 
             student.location_preference.toLowerCase() === opportunity.location.toLowerCase()) {
    score += 5;
  } else {
    score += 2; // Partial
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Generates an explanation of skill gaps for a specific opportunity.
 */
export function generateSkillGapReport(studentSkills: Skill[], requiredSkills: Skill[]) {
  return requiredSkills.map(req => {
    const stdSkill = studentSkills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
    const studentLevel = stdSkill?.proficiency || 0;
    const requiredLevel = req.required_level || 50;

    if (studentLevel >= requiredLevel) {
      return { skill: req, status: 'Strong match', ok: true };
    } else if (studentLevel >= requiredLevel - 20) {
      return { skill: req, status: 'Good match', ok: true };
    } else if (studentLevel > 0) {
      return { skill: req, status: 'Skill gap (Needs improvement)', ok: false };
    } else {
      return { skill: req, status: 'Skill gap (Missing)', ok: false };
    }
  });
}
