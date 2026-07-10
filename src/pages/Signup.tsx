import { useState } from 'react'
import type { FormEvent } from 'react'
import { signup } from '../apis/auth'

type SignupProps = {
  onMoveToLogin: () => void
}

function Signup({ onMoveToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    if (password !== passwordConfirm) {
      setMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    setIsSubmitting(true)

    try {
      await signup({ email, password, name })
      setMessage('회원가입 성공')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '회원가입 실패')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <label>
          이메일
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <label>
          비밀번호 확인
          <input
            type="password"
            name="passwordConfirm"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
        </label>

        <label>
          이름
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          회원가입
        </button>
      </form>

      {message && <p>{message}</p>}

      <p className="auth-link">
        이미 계정이 있으신가요?
        <button type="button" onClick={onMoveToLogin}>
          로그인
        </button>
      </p>
    </section>
  )
}

export default Signup
