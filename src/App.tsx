import Button from './components/Button'
import Radio from './components/Radio'
import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [page, setPage] = useState<'login' | 'signup'>('login')

  return (
    <main className="flex min-h-svh flex-col px-[15px] pt-[120px] pb-[50px] text-left">
      <h1 className="m-0 mb-10 text-[20px] leading-[140%] font-semibold tracking-[-0.5px] text-(--gray-100)">
        지금 가장 어려운 한 걸음은
        <br />
        무엇인가요?
      </h1>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="sr-only">가장 어려운 한 걸음 선택</legend>
        <Radio name="difficulty" value="move">
          한 발자국 움직이는 것
        </Radio>
        <Radio name="difficulty" value="outside">
          밖으로 나가는 것
        </Radio>
        <Radio name="difficulty" value="people">
          사람과 대면하는 것
        </Radio>
      </fieldset>

      <Button className="mt-auto">다음</Button>
    </main>
  )
}

export default App
