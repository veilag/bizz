import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "@/components/forms/auth/schema.ts";

interface LoginFormProps {
  onSubmit: (data: z.infer<typeof loginSchema>) => void

  isCodeShowed: boolean
  isLoading: boolean
}

const LoginForm = ({ onSubmit, isLoading, isCodeShowed }: LoginFormProps) => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <h2 className="font-bold text-lg">
            Авторизация
          </h2>
          <p className="text-muted-foreground text-sm">
            Войдите в систему BizzAI
          </p>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`${(isCodeShowed || isLoading) && 'text-muted-foreground'}`}>Имя пользователя</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="w-12 flex text-muted-foreground justify-center items-center rounded-md border border-input">
                    @
                  </div>
                  <Input disabled={isCodeShowed || isLoading} type="text" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className={`${(isCodeShowed || isLoading) && 'text-muted-foreground'}`}>Пароль</FormLabel>
              <FormControl>
                <Input disabled={isCodeShowed || isLoading} type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

        <div className="w-full flex gap-2 justify-center items-center mt-4">
          <Button disabled={isCodeShowed || isLoading} className="w-full" type="submit">{isLoading ? (<Loader className="animate-spin" />) : 'Авторизоваться'}</Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
