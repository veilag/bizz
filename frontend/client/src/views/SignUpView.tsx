import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "sonner";
import {Logo} from "@/assets/icons";

const SignUpView = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const formSchema = z.object({
    username: z.string().min(6, {
      message: "Введите не менее 6 символов"
    }),
    email: z.string().email({
      message: "Введите корректную почту"
    }),

    password: z.string().min(8, {
      message: "Введите не менее 8 символов"
    }),
    password_confirm: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirm: ""
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.password_confirm) {
      form.setError("password_confirm", {
        message: "Пароли не совпадают"
      })

      return
    }

    form.clearErrors()
    setLoading(true)

    axios.post("https://bizz-ai.ru/api/auth/signup", {
      username: values.username,
      email: values.email,
      password: values.password
    })
      .then(() => {
        setLoading(false)
        toast.success("Вы успешно зарегистрировались", {
          classNames: {
            toast: "w-fit"
          }
        })
        navigate("/login")
      })
      .catch((error) => {
        setLoading(false)

        switch (error.code) {
          case "ERR_BAD_REQUEST":
            toast.warning("Имя пользователя занято")
            break

          case "ERR_NETWORK":
            toast.error("Сервер не отвечает")
            break
        }
      })
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken !== null) navigate("/")
  }, []);

  return (
    <div className="flex relative flex-col items-center justify-center w-full h-screen">
      <div className="absolute w-full translate-y-[-50%] h-full flex justify-center gap-2 z-0">
        <div className="w-96 h-96 origin-right opacity-50 bg-blue-500 animate-rotate-out blur-[100px]"></div>
        <div className="w-96 h-96 origin-left opacity-50 bg-purple-500 animate-rotate-in delay-1000 blur-[100px]"></div>
      </div>

      <div className="absolute w-full h-full flex justify-center items-start z-5">
        <Logo className="w-20 h-20 mt-10 duration-200 hover:cursor-pointer hover:scale-125 transition-all ease-out"/>
      </div>

      <div className="w-96 z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-7">
              <h2 className="font-bold text-center text-2xl">
                Давайте знакомиться
              </h2>
              <p className="text-muted-foreground text-center">
                Станьте новым пользователем BizzAI
              </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({field}) => (
                <FormItem>
                  <FormLabel className={`${isLoading && 'text-muted-foreground'}`}>Имя пользователя</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div
                        className="w-12 flex text-muted-foreground justify-center items-center rounded-md border border-input">
                        @
                      </div>
                      <Input disabled={isLoading} type="text" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="mt-2">
                  <FormLabel className={`${isLoading && 'text-muted-foreground'}`}>Электронная почта</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="text" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="mt-2">
                  <FormLabel className={`${isLoading && 'text-muted-foreground'}`}>Пароль</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            <FormField
              control={form.control}
              name="password_confirm"
              render={({field}) => (
                <FormItem className="mt-2">
                  <FormLabel className={`${isLoading && 'text-muted-foreground'}`}>Повторите пароль</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>

            <div className="w-full flex gap-2 justify-center items-center mt-4">
              <Button disabled={isLoading} className="w-full" type="submit">{isLoading ? (
                <Loader className="animate-spin"/>) : 'Зарегистрироваться'}</Button>
            </div>
          </form>
        </Form>
        <Button onClick={() => navigate("/login")} className="w-full mt-2" variant="link">Назад</Button>
      </div>
    </div>
  )
}

export default SignUpView
