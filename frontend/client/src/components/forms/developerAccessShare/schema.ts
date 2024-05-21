import {z} from "zod";

const accessDeveloperShareSchema = z.object({
  username: z.string().min(6, {
    message: "Введите не менее 6 символов"
  }).max(30)
})

export {
  accessDeveloperShareSchema
}