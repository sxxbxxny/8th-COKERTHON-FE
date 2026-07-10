import Button from '../../components/Button'

function MyComplete3() {
  return (
    <section className="my-complete1-page">
      <main className="my-complete1-content">
        <div className="my-complete1-copy">
          <h1>
            열심히 한 걸음 내딛어 온 당신!
            <br />
            정말 수고 많았어요!!
          </h1>
          <p>
            혼자서는 어려웠던 한 걸음,
            <br />
            함께라서 여기까지 올 수 있었어요.
          </p>
        </div>

        <img
          className="my-complete1-character"
          src="/images/my_complete3_character.svg"
          alt=""
          aria-hidden="true"
        />
      </main>

      <div className="my-complete3-actions">
        <Button className="my-complete1-button">다음 스텝 넘어가기</Button>
        <Button className="my-complete1-button my-complete3-finish">끝내기</Button>
      </div>
    </section>
  )
}

export default MyComplete3
