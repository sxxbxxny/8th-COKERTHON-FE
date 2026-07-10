import { useState } from 'react'
import type { FormEvent } from 'react'
import { signup } from '../apis/auth'
import Button from '../components/Button'

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false)

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
    <section className="signup-page">
      <header className="signup-header">
        <button type="button" aria-label="로그인으로 돌아가기" onClick={onMoveToLogin}>
          <img src="/images/vector-19.svg" alt="" aria-hidden="true" />
        </button>
        <h1>이메일로 회원가입하기</h1>
      </header>

      <form className="signup-form" onSubmit={handleSignup}>
        <label className="signup-field">
          <span>가입할 이메일 입력해주세요</span>
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

        <label className="signup-field">
          <span>비밀번호를 설정해주세요</span>
          <div className="signup-password-input">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
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
              <img
                src={isPasswordVisible ? '/eye.svg' : '/closeeye.svg'}
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>
        </label>

        <label className="signup-field">
          <span>비밀번호를 한번 더 입력해주세요</span>
          <div className="signup-password-input">
            <input
              type={isPasswordConfirmVisible ? 'text' : 'password'}
              name="passwordConfirm"
              autoComplete="new-password"
              placeholder="************"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
            />
            <button
              type="button"
              aria-label={
                isPasswordConfirmVisible ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'
              }
              onClick={() => setIsPasswordConfirmVisible((current) => !current)}
            >
              <img
                src={isPasswordConfirmVisible ? '/eye.svg' : '/closeeye.svg'}
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>
        </label>

        <label className="signup-field">
          <span>이름을 입력해주세요</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        {message && <p className="signup-message">{message}</p>}

        <Button className="signup-submit" type="submit" disabled={isSubmitting}>
          다음
        </Button>
      </form>
    </section>
  )
}

export default Signup
