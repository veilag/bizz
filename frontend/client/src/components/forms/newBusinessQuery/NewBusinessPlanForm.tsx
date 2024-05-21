import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
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
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem className="mt-2">
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4 w-full" type="submit">
          {isLoading ? <Loader className="animate-spin" size={18} /> : 'Создать'}
        </Button>
      </form>
    </Form>
  )
}

export default NewBusinessPlanForm
