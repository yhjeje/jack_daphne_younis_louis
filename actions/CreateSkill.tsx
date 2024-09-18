"use server";
 
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addSkill } from "./AddSkill";
import { SkillError } from "@/types/SkillError";
 
const SkillSchema = z.object({
  rowid: z.number(),
  skill_name: z.string().min(1).max(255),
  skill_level: z.enum(["1", "2", "3", "4", "5"]),
  user: z.number(),
});
 
const ZodCreateSkill = SkillSchema.omit({ rowid: true, user: true });
 
export async function CreateSkill(prevState: SkillError, formData: FormData) {
  try {
    const validatedFields = ZodCreateSkill.safeParse({
      skill_name: formData.get("skill_name"),
      skill_level: formData.get("skill_level"),
    });
 
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Error, failed to add skill",
      };
    }
 
    const { skill_name, skill_level } = validatedFields.data;
 
    const add = await addSkill(skill_name, skill_level);
 
    if (!add.ok || add.status >= 300) {
      const { message } = await add.json();
      return {
        errors: { skill_name: [message] },
        message: message,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An error occured",
    };
  }
    // Here, skill was successfully added
    revalidatePath("/mon-compte/profil"); // it will update the set with the new data
    redirect("/mon-compte/profil");
  } catch (error) {
    // If it's a redirection after a new skill is added
    if (isRedirectError(error)) {
      throw error;
    }
    // If it's a form validation error
    if (error instanceof z.ZodError) {
      const errors: Array<string> = [];
      // Get all errors
      error.issues.forEach((issue) => {
        errors.push(issue.message);
      });
 
      throw new Error(errors.join(", "));
    } else if (typeof error === "object") {
      // catch errors like "skill already exist"
      throw new Error(error?.toString());
    }
    throw new Error("An error occured");
  }
}