import {z} from "zod";

const schema = z.object({
  name: z.string().min(6, {
    message: "Введите не менее 6 символов"
  }).max(30),

  query: z.string().min(10, {
    message: "Введите не менее 10 символов"
  }),

  description: z.string(),

  city: z.string({
    required_error: "Выберите город"
  })
})

export default schema
