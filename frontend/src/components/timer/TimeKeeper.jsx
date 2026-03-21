import { useState, useEffect } from "react";

function TimeKeeper({ children }) {
  function useTimer() {
    const [timeInMs, setTimeInMs] = useState(0);
    const [timerOn, setTimerOn] = useState(false);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
      if (!timerOn) return;

      const interval = setInterval(() => {
        // performance.now() is the most accurate and can keep calculating in background
        setTimeInMs(performance.now() - startTime);
        // update timer loop at 30 Hz (30 updates per second)
      }, 30);

      return () => clearInterval(interval);
    }, [timerOn, startTime]);

    function startTimer() {
      setStartTime(performance.now());
      setTimerOn(true);
    };

    function stopTimer() {setTimerOn(false)};

    return { timerOn, timeInMs, startTimer, stopTimer };
  }
  // move timer out of App to make it a stable function
  // turn into function to avoid starting it on render and multiple rerenders
  const timer = useTimer();

  // return timer as a function to child component (tab)
  return children(timer);
};

export default TimeKeeper;
