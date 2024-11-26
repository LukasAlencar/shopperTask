import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"

export const formSchema = z.object({
    custumer_id: z
      .string()
      .min(1, 'O campo não pode ser vazio')
      .refine((value) => value.trim().length > 0, 'O campo não pode conter apenas espaços'),
    origin: z
      .string()
      .min(1, 'O campo não pode ser vazio')
      .refine((value) => value.trim().length > 0, 'O campo não pode conter apenas espaços'),
    destination: z
      .string()
      .min(1, 'O campo não pode ser vazio')
      .refine((value) => value.trim().length > 0, 'O campo não pode conter apenas espaços'),
  });

type FormRideProps = {
    onSubmit: (values: z.infer<typeof formSchema>) => void
}

export const FormRide = ({onSubmit}: FormRideProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            custumer_id: '',
            origin: '',
            destination: '',
        },
    })

    return (
      <>
          <header className='flex flex-col items-center'>
              <h1 className='text-slate-200 text-2xl'>Tenha um boa viagem!</h1>
              <h3 className='text-slate-200 text-lg'>Viagem com segurança</h3>
          </header>
          <main className='w-3/6'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                      control={form.control}
                      name="custumer_id"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-slate-100'>Insira o Id do Usuário</FormLabel>
                            <FormControl>
                              <Input className='text-slate-200' placeholder="Id do usuário" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                    />
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel className='text-slate-100'>Onde está?</FormLabel>
                          <FormControl>
                            <Input className='text-slate-200' placeholder="Origem" {...field} />
                          </FormControl>
                          <FormDescription>
                            Insira o lugar de onde quer partir
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-slate-100'>Para onde vai?</FormLabel>
                        <FormControl>
                          <Input className='text-slate-200' placeholder="Destino" {...field} />
                        </FormControl>
                        <FormDescription>
                          Insira o lugar onde quer chegar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />  
                  <Button className='w-full' type="submit">Buscar Motorista</Button>
              </form>
            </Form>
        </main>
      </>
    )
}