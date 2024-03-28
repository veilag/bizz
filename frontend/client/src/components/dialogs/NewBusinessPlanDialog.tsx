import {ReactNode, useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectTrigger, SelectContent, SelectValue, SelectItem} from "@/components/ui/select.tsx";
import axios from "axios";
import {toast} from "sonner";
import {Loader} from "react-feather";
import {BusinessGeneration} from "@/types/business.ts";
import {useDispatch} from "react-redux";
import {addQuery} from "@/store/slice/business.ts";

interface NewBusinessPlanDialogProps {
  children: ReactNode
}

const formSchema = z.object({
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

const NewBusinessPlanDialog = ({ children }: NewBusinessPlanDialogProps) => {
  const dispatch = useDispatch()

  const [isOpen, setOpen] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      query: "",
      description: ""
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    const accessToken = localStorage.getItem("accessToken")

    axios.post<BusinessGeneration>("http://localhost:8000/business/generate", {
      name: data.name,
      query: data.query,
      description: data.description,
      city: data.city
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        dispatch(addQuery({
          ...res.data,
          createdAt: new Date(res.data.createdAt).getTime()
        }))

        setOpen(false)
        setLoading(false)
        toast.success("Генерация отправлена на очередь")
      })
      .catch(() => {
        setOpen(false)
        setLoading(false)
        toast.error("Ошибка на сервере")
      })
  }

  useEffect(() => {
    form.reset()

  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Генерация нового плана</DialogTitle>
          <DialogDescription>
            Генерация плана будет ожидать своей очереди,
            статус генерации можно посмотреть в списке планов
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Название плана</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="query"
              render={({field}) => (
                <FormItem className="mt-2">
                  <FormLabel>Запрос на генерацию</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem className="mt-2">
                  <FormLabel>Дополнительное описание</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({field}) => (
                <FormItem className="mt-2">
                  <FormLabel>Город</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите город" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Альметьевск">Альметьевск</SelectItem>
                      <SelectItem value="Казань">Казань</SelectItem>
                      <SelectItem value="Москва">Москва</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4 w-full" type="submit">
              {isLoading ? <Loader className="animate-spin" size={18} /> : 'Сгенерировать'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewBusinessPlanDialog
