import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const defaultPersonalMissionsStorageKey = 'step1PersonalMissionsV2'

const getPersonalMissions = (storageKey = defaultPersonalMissionsStorageKey) => {
  const storedMissions = localStorage.getItem(storageKey)

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
  const location = useLocation()
  const [mission, setMission] = useState('')
  const returnTo =
    typeof location.state === 'object' &&
    location.state !== null &&
    'returnTo' in location.state &&
    typeof location.state.returnTo === 'string'
      ? location.state.returnTo
      : '/mission/step1'
  const storageKey =
    typeof location.state === 'object' &&
    location.state !== null &&
    'storageKey' in location.state &&
    typeof location.state.storageKey === 'string'
      ? location.state.storageKey
      : defaultPersonalMissionsStorageKey

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMission = mission.trim()

    if (!nextMission) {
      return
    }

    const personalMissions = [...getPersonalMissions(storageKey), nextMission]
    localStorage.setItem(storageKey, JSON.stringify(personalMissions))
    navigate(returnTo)
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
