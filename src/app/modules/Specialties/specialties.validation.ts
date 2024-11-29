import { z } from "zod";

const createValidation = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
});

export const SpecialtiesValidation = {
    createValidation,
};
