import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "@/components/forms/auth/schema.ts";
import AnimateIn from "@/components/ui/animate.ts";

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
        <div className="mb-7">
            <h2 className="font-bold text-center text-2xl">
              Добро пожаловать
            </h2>
            <p className="text-muted-foreground text-center">
              Войдите в систему BizzAI
            </p>
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <AnimateIn
                from="opacity-0 -translate-y-4"
                to="opacity-100 translate-y-0 translate-x-0"
                duration={300}
                delay={25}
              >
              <FormLabel className={`${isLoading && 'text-muted-foreground'}`}>Имя пользователя</FormLabel>
              <FormControl className="mt-2">
                  <div className="flex gap-2">
                    <div className="w-12 flex text-muted-foreground justify-center items-center rounded-md border border-input">
                      @
                    </div>
                    <Input disabled={isLoading} type="text" {...field} />
                  </div>
              </FormControl>
              </AnimateIn>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-2">
              <AnimateIn
                from="opacity-0 -translate-y-4"
                to="opacity-100 translate-y-0 translate-x-0"
                duration={300}
                delay={100}
              >
                <FormLabel className={`${(isCodeShowed || isLoading) && 'text-muted-foreground'}`}>Пароль</FormLabel>
                <FormControl className="mt-2">
                  <Input disabled={isLoading} type="password" {...field} />
                </FormControl>
              </AnimateIn>
              <FormMessage />
            </FormItem>
          )} />

        <div className="w-full flex gap-2 justify-center items-center mt-4">
          <AnimateIn
            className="w-full"
            from="opacity-0 -translate-y-4"
            to="opacity-100 translate-y-0 translate-x-0"
            duration={300}
            delay={150}
          >
            <Button disabled={isLoading} className="w-full" type="submit">{isLoading ? (<Loader className="animate-spin" />) : 'Авторизоваться'}</Button>
          </AnimateIn>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
