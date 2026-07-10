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
    'flex w-[360px] max-w-full self-stretch items-center gap-2 rounded-[20px] border border-[var(--gray-20,#F0F0F0)] bg-[var(--gray-00,#FFF)] p-5 box-border text-left cursor-pointer has-checked:border-[var(--P-50,#FFB89F)] has-checked:bg-[var(--s-10,#FFF5F0)] has-disabled:cursor-not-allowed has-disabled:opacity-50',
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
      <span className="size-4 aspect-square shrink-0 rounded-full border border-(--gray-40) bg-(--gray-00) transition-colors peer-checked:border-[var(--P-50,#FFB89F)] peer-checked:bg-[var(--P-50,#FFB89F)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#933732]/45" />
      <span className="font-[Pretendard] text-[18px] leading-[140%] font-semibold tracking-[-0.45px] text-[var(--gray-80,#555)] not-italic">
        {children}
      </span>
    </label>
  )
}

export default Radio
