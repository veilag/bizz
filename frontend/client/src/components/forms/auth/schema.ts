import {z} from "zod";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Введите не менее 6 символов"
  }).max(30),

  password: z.string().min(8, {
    message: "Введите не менее 8 символов"
  })
})

export {
  loginSchema
}
