import { useState } from 'react'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'
import { Form } from './components/Form'
import './styles/golbal.css'

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'O tamanoho maximo do arquive e 5Mb',
    ),
  name: z
    .string()
    .nonempty('Nome obrigatorio')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('Email obrigatorio')
    .email('Formato de email ivalido')
    .refine(
      (email) => email.endsWith('@gmail.com'),
      'Precisa ser um email gmail',
    ),

  password: z.string().min(6, 'A senha precisa de no minimo 6 caracteres'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('Titulo Obrigatorio'),
        knowledge: z.coerce.number().min(1).max(100),
      }),
    )
    .min(2, 'Insira pelo menos 2 tecnologias'),
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('')

  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = createUserForm

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  async function createUser(data: CreateUserFormData) {
    await supabase.storage.from('avatar').upload(data.avatar.name, data.avatar)
    setOutput(JSON.stringify(data, null, 2))
  }

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function removeTech(index: number) {
    remove(index)
  }

  return (
    <main className="h-screen bg-slate-900 text-zinc-100 flex flex-col gap-4 items-center justify-center">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={handleSubmit(createUser)}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <Form.Field>
            <Form.Label htmlFor="avatar">Avatar</Form.Label>
            <Form.Input type="file" name="avatar" />
            <Form.ErrorMessage field="avatar" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="name">Nome</Form.Label>
            <Form.Input type="text" name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Input type="email" name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>
            <Form.Input type="password" name="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>

          <Form.Field>
            <Form.Label className="flex items-center justify-between">
              Tecnologias
              <button
                type="button"
                onClick={addNewTech}
                className="text-emerald-500 text-sm"
              >
                Adicionar
              </button>
            </Form.Label>
            {fields.map((field, index) => (
              <Form.Field key={field.id}>
                <div className="flex gap-2 items-center">
                  <Form.Input type="text" name={`techs.${index}.title`} />

                  <button
                    className="text-red-500 text-lg"
                    onClick={() => removeTech(index)}
                    type="button"
                  >
                    ⨉
                  </button>
                </div>
                <Form.ErrorMessage field={`techs.${index}.title`} />
              </Form.Field>
            ))}
            <Form.ErrorMessage field="techs" />
          </Form.Field>

          <button
            disabled={isSubmitting}
            className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600 disabled:opacity-10 disabled:cursor-not-allowed"
            type="submit"
          >
            Salvar
          </button>
        </form>
      </FormProvider>

      <pre>{output}</pre>
    </main>
  )
}
