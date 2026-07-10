import { useState } from 'react'
import type { FormEvent } from 'react'
import { login } from '../apis/auth'
import Button from '../components/Button'

type LoginProps = {
  onMoveToSignup: () => void
}

function Login({ onMoveToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

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
    <section className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <label className="login-field">
          <span>이메일</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="user@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>비밀번호</span>
          <div className="login-password-input">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="************"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              onClick={() => setIsPasswordVisible((current) => !current)}
            >
              <img src="/closeeye.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </label>

        <div className="login-links">
          <span>아직 계정이 없나요?</span>
          <button type="button" onClick={onMoveToSignup}>
            이메일로 회원가입
          </button>
        </div>

        {message && <p className="login-message">{message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          로그인하기
        </Button>
      </form>
    </section>
  )
}

export default Login
