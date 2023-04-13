import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
}

export function Input(props: InputProps) {
  const { register } = useFormContext()

  return (
    <input
      id={props.name}
      className="border bg-zinc-800 border-slate-500 text-zinc-100 shadow-sm rounded h-10 px-3 py-1"
      {...register(props.name)}
      {...props}
    />
  )
}
