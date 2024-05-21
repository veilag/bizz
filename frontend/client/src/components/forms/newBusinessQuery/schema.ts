import {z} from "zod";

const schema = z.object({
  name: z.string().min(6, {
    message: "Введите не менее 6 символов"
  }).max(30),
  description: z.string()
})

export default schema
