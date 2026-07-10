import { useState } from 'react'
import type { FormEvent } from 'react'
import { login } from '../apis/auth'

type LoginProps = {
  onMoveToSignup: () => void
}

function Login({ onMoveToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await login({ email, password })
      localStorage.setItem('accessToken', response.result.accessToken)
      localStorage.setItem('refreshToken', response.result.refreshToken)
      setMessage('로그인 성공')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '로그인 실패')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          로그인
        </button>
      </form>

      {message && <p>{message}</p>}

      <p className="auth-link">
        계정이 없으신가요?
        <button type="button" onClick={onMoveToSignup}>
          회원가입
        </button>
      </p>
    </section>
  )
}

export default Login
