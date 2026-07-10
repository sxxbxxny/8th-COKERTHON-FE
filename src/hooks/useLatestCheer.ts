import { useEffect, useState } from 'react'
import { getCheers } from '../apis/cheers'

const defaultCheerMessage = '오늘도 화이팅하세요 :)'

export function useLatestCheer() {
  const [cheerMessage, setCheerMessage] = useState(defaultCheerMessage)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) return

    let isMounted = true

    getCheers()
      .then(({ result }) => {
        if (!isMounted) return

        const latestCheer = result.find((cheer) => cheer.content.trim().length > 0)

        if (latestCheer) {
          setCheerMessage(latestCheer.content)
        }
      })
      .catch(() => {
        if (isMounted) setCheerMessage(defaultCheerMessage)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return cheerMessage
}
