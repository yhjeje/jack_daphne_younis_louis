export type SkillError = {
    errors?: {
      skill_name?: string[];
      skill_level?: string[];
    };
    message?: string | null;
  };