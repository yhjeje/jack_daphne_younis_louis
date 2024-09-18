"use client";

import { useFormState } from 'react-dom';
import { CreateSkill } from "@/actions/CreateSkill";
import { SkillError } from "@/types/SkillError";

export default function SkillForm() {
  const initialState: SkillError = { message: null, errors: {} };
  const [state, formAction] = useFormState(CreateSkill, initialState);
  return (
    <form action={formAction}>
      <label htmlFor="skill_name">Compétence : </label>
      <input
        type="text"
        name="skill_name"
        id="skill_name"
        placeholder="NextJS"
      />
      {/* show skill_name errors */}
      {state.errors?.skill_name &&
        state.errors.skill_name.map((error: string) => (
          <p style={{ color: "red" }} key={error}>
            {error}
          </p>
        ))}
      <br />
      <label htmlFor="skill_level">Niveau : </label>
      <br />
      <input
        type="range"
        name="skill_level"
        id="skill_level"
        min="1"
        max="5"
        step="1"
      />
      {/* show skill_level errors */}
      {state.errors?.skill_level &&
        state.errors.skill_level.map((error: string) => (
          <p style={{ color: "red" }} key={error}>
            {error}
          </p>
        ))}
      <br />
      <input type="submit" name="skill_add" value="Ajouter" />
      {/* show others errors */}
      {!state.errors && state.message && (
        <p style={{ color: "red" }} key={state.message}>
          {state.message}
        </p>
      )}
    </form>
  );
}