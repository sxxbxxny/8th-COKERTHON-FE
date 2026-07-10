import type { InputHTMLAttributes, ReactNode } from 'react'

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  children: ReactNode
  className?: string
  inputClassName?: string
}

function Radio({
  children,
  className = '',
  inputClassName = '',
  disabled,
  ...props
}: RadioProps) {
  const containerClasses = [
    'flex w-full self-stretch items-center gap-2 rounded-[20px] border border-[var(--gray-20,#F0F0F0)] bg-[var(--gray-00,#FFF)] p-5 box-border text-left cursor-pointer has-disabled:cursor-not-allowed has-disabled:opacity-50',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inputClasses = ['peer sr-only', inputClassName]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={containerClasses}>
      <input
        type="radio"
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-(--gray-40) bg-(--gray-00) after:size-2 after:scale-0 after:rounded-full after:bg-[#FFB89F] after:transition-transform peer-checked:border-[#FFB89F] peer-checked:after:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#933732]/45" />
      <span className="font-[Pretendard] text-[18px] leading-[140%] font-semibold tracking-[-0.45px] text-[var(--gray-80,#555)] not-italic">
        {children}
      </span>
    </label>
  )
}

export default Radio
