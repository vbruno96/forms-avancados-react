import { useState } from 'react'
import './styles/golbal.css'

import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

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
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input type="file" accept="image/*" {...register('avatar')} />
          {errors.avatar && (
            <span className="text-red-500 text-sm">
              {errors.avatar.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
            type="text"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => (
            <div className="flex gap-2" key={field.id}>
              <div className="flex-1 flex flex-col gap-1">
                <input
                  className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
                  type="text"
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title && (
                  <span className="text-red-500 text-sm">
                    {errors.techs?.[index]?.title?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  className="w-16 border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
                  type="number"
                  {...register(`techs.${index}.knowledge`)}
                />
                {errors.techs?.[index]?.knowledge && (
                  <span className="text-red-500 text-sm">
                    {errors.techs?.[index]?.knowledge?.message}
                  </span>
                )}
              </div>
              <button
                className="text-red-500 text-lg"
                onClick={() => removeTech(index)}
                type="button"
              >
                ⨉
              </button>
            </div>
          ))}

          {errors.techs && (
            <span className="text-red-500 text-sm">
              {errors.techs?.message}
            </span>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600 disabled:opacity-10 disabled:cursor-not-allowed"
          type="submit"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}
