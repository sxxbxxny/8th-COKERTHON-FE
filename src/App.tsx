import Button from './components/Button'

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-end px-[15px] pb-[50px]">
      <Button onClick={() => alert('버튼이 클릭됐어요!')}>시작하기</Button>
    </main>
  )
}

export default App
