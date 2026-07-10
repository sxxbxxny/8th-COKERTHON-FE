import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

function MyComplete1() {
  const navigate = useNavigate()

  return (
    <section className="my-complete1-page">
      <main className="my-complete1-content">
        <div className="my-complete1-copy">
          <h1>
            이불 밖으로 한 걸음
            <br />
            드디어 나왔어요!
          </h1>
          <p>다음 스텝, 문 밖으로 나가볼까요?</p>
        </div>

        <img
          className="my-complete1-character"
          src="/images/my_complete1_character.svg"
          alt=""
          aria-hidden="true"
        />
      </main>

      <Button className="my-complete1-button" onClick={() => navigate('/my/step2')}>
        다음 스텝 넘어가기
      </Button>
    </section>
  )
}

export default MyComplete1
