import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const getPersonalMissions = () => {
  const storedMissions = localStorage.getItem('personalMissionsV2')

  if (storedMissions) {
    try {
      const parsedMissions = JSON.parse(storedMissions)

      if (Array.isArray(parsedMissions)) {
        return parsedMissions.filter((mission): mission is string => typeof mission === 'string')
      }
    } catch {
      return []
    }
  }

  return []
}

function Goal() {
  const navigate = useNavigate()
  const [mission, setMission] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMission = mission.trim()

    if (!nextMission) {
      return
    }

    const personalMissions = [...getPersonalMissions(), nextMission]
    localStorage.setItem('personalMissionsV2', JSON.stringify(personalMissions))
    navigate('/mission/step1')
  }

  return (
    <main className="mission-goal-page">
      <form className="mission-goal-form" onSubmit={handleSubmit}>
        <label htmlFor="personal-mission-input">나의 미션</label>
        <input
          id="personal-mission-input"
          value={mission}
          onChange={(event) => setMission(event.target.value)}
          placeholder="오늘의 작은 미션을 입력하세요"
          autoFocus
        />
        <button type="submit" disabled={!mission.trim()}>
          등록하기
        </button>
      </form>
    </main>
  )
}

export default Goal
