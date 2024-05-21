import {z} from "zod";
import {accessDeveloperShareSchema} from "@/components/forms/developerAccessShare/schema.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";

interface DeveloperAccessShareFormProps {
  onSubmit: (data: z.infer<typeof accessDeveloperShareSchema>) => void
  isLoading: boolean
}

const DeveloperAccessShareForm = ({onSubmit, isLoading}: DeveloperAccessShareFormProps) => {
  const form = useForm<z.infer<typeof accessDeveloperShareSchema>>({
    resolver: zodResolver(accessDeveloperShareSchema),
    defaultValues: {
      username: "",
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="w-12 flex text-muted-foreground justify-center items-center rounded-md border border-input">
                    @
                  </div>
                  <Input type="text" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

        <div className="w-full flex gap-2 justify-center items-center mt-4">
          <Button className="w-full" type="submit">{isLoading ? (<Loader className="animate-spin" />) : 'Поделиться'}</Button>
        </div>
      </form>
    </Form>
  )
}

export default DeveloperAccessShareForm