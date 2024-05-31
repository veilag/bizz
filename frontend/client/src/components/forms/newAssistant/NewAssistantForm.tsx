import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import assistantSchema from "@/components/forms/newAssistant/schema.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Assistant} from "@/atoms/assistant.ts";
import {Switch} from "@/components/ui/switch.tsx";

interface NewAssistantFormProps {
  onSubmit: (data: z.infer<typeof assistantSchema>) => void
  initialAssistant?: Assistant
  isLoading: boolean
}

const NewAssistantForm = ({onSubmit, isLoading, initialAssistant}: NewAssistantFormProps) => {
  const form = useForm<z.infer<typeof assistantSchema>>({
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      name: initialAssistant?.name || "",
      username: initialAssistant?.username || "",
      isDataAccessible: initialAssistant?.isDataAccessible || false,
      description: initialAssistant?.description || "",
    }
  })

  const handleSubmit = (data: z.infer<typeof assistantSchema>) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form className="py-2 px-4" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Имя ассистента</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem className="mt-2">
              <FormLabel>Уникальное имя на латинице</FormLabel>
              <FormControl>
                <Input disabled={initialAssistant !== undefined} {...field} />
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
              <FormLabel>Описание ассистента</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isDataAccessible"
          render={({ field }) => (
            <FormItem className="mt-2 flex items-center justify-between">
              <FormLabel className="mt-1">Публичный доступ к данным</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="mt-4 w-full" type="submit">
          {isLoading ? <Loader className="animate-spin" size={18} /> : 'Сохранить' }
        </Button>
      </form>
    </Form>
  )
}

export default NewAssistantForm
