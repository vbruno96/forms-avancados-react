import { useState } from 'react'
import './styles/golbal.css'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
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
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="h-screen bg-slate-900 text-zinc-100 flex flex-col gap-4 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">Nome</label>
          <input
            className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
            type="text"
            {...register('name')}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
            type="email"
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3"
            type="password"
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
          type="submit"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}
