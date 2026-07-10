import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

function MyComplete2() {
  const navigate = useNavigate()

  return (
    <section className="my-complete1-page">
      <main className="my-complete1-content">
        <div className="my-complete1-copy">
          <h1>
            문 밖으로 한 걸음
            <br />
            드디어 나왔어요!
          </h1>

          <p>
            다음 스텝, 친구를 향해 한 걸음 나아가볼까요?
          </p>
        </div>

        <img
          className="my-complete1-character"
          src="/images/my_complete2_character.svg"
          alt=""
          aria-hidden="true"
        />
      </main>

      <Button
        className="my-complete1-button"
        onClick={() => navigate('/my/step3')}
      >
        다음 스텝 넘어가기
      </Button>
    </section>
  )
}

export default MyComplete2