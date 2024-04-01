import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {useForm} from "react-hook-form";
import {z} from "zod";
import schema from "@/components/forms/newBusinessQuery/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";

interface NewBusinessPlanFormProps {
  onSubmit: (data: z.infer<typeof schema>) => void
  isLoading: boolean
}

const NewBusinessPlanForm = ({ onSubmit, isLoading }: NewBusinessPlanFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      query: "",
      description: ""
    }
  })

  const handleSubmit = (data: z.infer<typeof schema>) => {
    form.reset()
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
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
              <FormLabel>Кратко опишите бизнес</FormLabel>
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
              <FormLabel>Расскажите подробнее</FormLabel>
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
  )
}

export default NewBusinessPlanForm
