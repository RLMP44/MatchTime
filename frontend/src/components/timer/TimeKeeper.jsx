import { useState, useEffect } from "react";

function TimeKeeper({ children }) {
  function useTimer() {
    const [timeInMs, setTimeInMs] = useState(0);
    const [timerOn, setTimerOn] = useState(false);
    const [startTime, setStartTime] = useState(null);

    const updateTime = () => {
      if (startTime == null) return;
      // performance.now() is the most accurate and can keep calculating in background
      setTimeInMs(performance.now() - startTime);
    };

    useEffect(() => {
      if (!timerOn) return;
      // update timer loop at 30 Hz (30 updates per second)
      const interval = setInterval(updateTime, 30);

      return () => clearInterval(interval);
    }, [timerOn]);

    function manualUpdate() {
      updateTime();
    }

    function startTimer() {
      setStartTime(performance.now());
      setTimerOn(true);
    };

    function stopTimer() {setTimerOn(false)};

    return { timerOn, timeInMs, startTimer, stopTimer, manualUpdate };
  }
  // move timer out of App to make it a stable function
  // turn into function to avoid starting it on render and multiple rerenders
  const timer = useTimer();

  // return timer as a function to child component (tab)
  return children(timer);
};

export default TimeKeeper;
