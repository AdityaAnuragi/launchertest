import { useEffect, useRef, useState } from "react";

export function useStopWatch(interval = 100): [isTicking: boolean, timeElapsed: number, toggle: () => void] {
  const [isTicking, setIsTicking] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)

  const startTime = useRef(0)

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if( isTicking ) {
      startTime.current = Date.now()
      setIsTicking(true)
      intervalId = setInterval(() => {
        setTimeTaken(Date.now() - startTime.current)
      }, interval)
    }

    return () => {
      clearInterval(intervalId)
    }

  }, [isTicking])

  function toggle() {
    setIsTicking(curr => !curr)
  }

  return [isTicking, timeTaken, toggle]

}