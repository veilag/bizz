import {z} from "zod";

const assistantSchema = z.object({
  name: z.string().min(6, {
    message: "Введите не менее 6 символов"
  }),
  username: z.string().min(4),
  isDataAccessible: z.boolean(),
  description: z.string(),
})

export default assistantSchema
