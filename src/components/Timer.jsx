import { useState, useEffect } from "react";

function Timer(props) {
  const [timerOn, setTimerOn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState("0");
  const [hour, setHour] = useState("HH");
  const [min, setMin] = useState("MM");
  const [sec, setSec] = useState("SS");
  const [milli, setMilli] = useState("mm");

  const [bibNum, setBibNum] = useState(null);
  const [name, setName] = useState(null);
  const [place, setPlace] = useState(1);
  const [buttonText, setButtonText] = useState("Start");
  const [currentRecord, setCurrentRecord] = useState(null);

  // ---------------------- TIMER LOGIC START ----------------------
  function startTimer() {
    setStartTime(performance.now());
    setTimerOn(true);
  }

  // function stopTimer() {
  //   setTimerOn(false);
  //   // TODO: create race end button away from timer UI to avoid accidents
  // }

  useEffect(() => {
    if (!timerOn) return;

    const interval = setInterval(() => {
      // performance.now() is the most accurate and can keep calculating in background
      const timeElapsed = (performance.now() - startTime);
      const hours = Math.floor(timeElapsed / 3_600_000);
      const mins = Math.floor((timeElapsed % 3_600_000) / 60_000);
      const seconds = Math.floor((timeElapsed % 60000) / 1000);
      const millis = (Math.floor(timeElapsed % 1000) / 10).toFixed(0);

      const padHours = hours.toString().padStart(2, "0");
      const padMins = mins.toString().padStart(2, "0");
      const padSeconds = seconds.toString().padStart(2, "0");
      const padMillis = millis.toString().padStart(2, "0");

      setHour(padHours);
      setMin(padMins);
      setSec(padSeconds);
      setMilli(padMillis);
      setTime(`${padHours}:${padMins}:${padSeconds}:${padMillis}`)
      // update timer loop at 30 Hz (30 updates per second)
    }, 30);

    return () => clearInterval(interval);
  }, [timerOn, startTime]);
  // ---------------------- TIMER LOGIC END ----------------------

  async function updateRecord({prevTime: prevTime, prevPlace: prevPlace, bib: bib}) {
    // create and update copy to avoid bugging react useState
    const updatedRecord = { ...currentRecord,
      place: prevPlace ?? place,
      time: prevTime ?? time,
      bib: bib ?? currentRecord?.bib
    };
    setCurrentRecord(updatedRecord);
    props.updateUserRecord(updatedRecord);
  }

  async function fetchAndSetRecord(newNum) {
    const newRecord = await props.fetchRecord(parseInt(newNum))
    // TODO: make sure not allowing users to be entered more than once
    newRecord ? setCurrentRecord(newRecord) : setCurrentRecord({id: null, place: place, bib: newNum, time: time, name: "Not Found"});
    setName(newRecord ? newRecord.name : "Not Found");
  }

  function reset() {
    setBibNum(null);
    setName(null);
  }

  function handleClick(event) {
    var target = event.target;
    if (target.value) {
      const updatedBibNum = (bibNum !== null) ? bibNum + target.value : target.value;
      setBibNum(updatedBibNum);
      fetchAndSetRecord(updatedBibNum);
    } else if (target.id === "start-record-button" && buttonText === "Start") {
      setButtonText("Record");
      startTimer();
    } else if (target.id === "start-record-button") {
      updateRecord({prevTime: null, prevPlace: null, bib: null});
      reset();
      setPlace(prev => prev + 1);
    } else if (target.id === "clear-button") {
      reset();
    } else if (target.id === "same-time-button") {
      const lastRecord = props.displayRecords.at(-1);
      updateRecord({prevTime: lastRecord.time, prevPlace: lastRecord.place, bib: bibNum});
      reset();
      setPlace(prev => prev + 1);
    }
  }

  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: {hour}:{min}:{sec}:{milli}</h4>
        <h4>Place: {place}</h4>
        <h4>Bib#: {bibNum}</h4>
        <h4>Name: {name}</h4>
      </div>
      <div className="timer-buttons-container">
        <button onClick={handleClick} id="button-1" className="timer-button timer-btn-reg" value="1">1</button>
        <button onClick={handleClick} id="button-2" className="timer-button timer-btn-reg" value="2">2</button>
        <button onClick={handleClick} id="button-3" className="timer-button timer-btn-reg" value="3">3</button>
        <button onClick={handleClick} id="button-4" className="timer-button timer-btn-reg" value="4">4</button>
        <button onClick={handleClick} id="button-5" className="timer-button timer-btn-reg" value="5">5</button>
        <button onClick={handleClick} id="button-6" className="timer-button timer-btn-reg" value="6">6</button>
        <button onClick={handleClick} id="button-7" className="timer-button timer-btn-reg" value="7">7</button>
        <button onClick={handleClick} id="button-8" className="timer-button timer-btn-reg" value="8">8</button>
        <button onClick={handleClick} id="button-9" className="timer-button timer-btn-reg" value="9">9</button>
        <button onClick={handleClick} id="same-time-button" className="timer-button timer-btn-color">Same<br></br>Time</button>
        <button onClick={handleClick} id="button-0" className="timer-button timer-btn-reg" value="0">0</button>
        <button onClick={handleClick} id="clear-button" className="timer-button timer-btn-color">Clear</button>
        <button onClick={handleClick} id="start-record-button" className="timer-button timer-btn-color">{buttonText}</button>
      </div>
    </div>
  );
}

export default Timer;
