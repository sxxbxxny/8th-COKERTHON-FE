import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

function Button({ children, className = '', type = 'button', ...props }: ButtonProps) {
  const classes = [
    'flex h-[60px] w-[360px] max-w-full items-center justify-center gap-[10px] rounded-[20px] border-0 bg-linear-to-r from-[#FFB8B8] to-[#FFB89F] px-0 py-3 shadow-[0_0_8px_0_#FFB8B8] box-border cursor-pointer font-[Pretendard] text-[18px] leading-normal font-semibold tracking-[-0.45px] text-(--color-gray-10) not-italic disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--gray-30,#E6E6E6)] disabled:text-[var(--gray-00,#FFF)] disabled:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#933732]/45',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
