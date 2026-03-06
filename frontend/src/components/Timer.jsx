import { useState, useEffect } from "react";
import { checkIsPresent } from "../utils/helpers";

function Timer(props) {
  const [time, setTime] = useState("0");
  const [hour, setHour] = useState("HH");
  const [min, setMin] = useState("MM");
  const [sec, setSec] = useState("SS");
  const [milli, setMilli] = useState("mm");

  const [bibNum, setBibNum] = useState(null);
  const [fName, setFName] = useState(null);
  const [lName, setLName] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);


  // ---------------------- TIMER LOGIC ----------------------
  useEffect(() => {
    if (!props.timerOn) return;

    const interval = setInterval(() => {
      // performance.now() is the most accurate and can keep calculating in background
      const timeElapsed = (performance.now() - props.startTime);
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
  }, [props.timerOn, props.startTime]);


  // ---------------------- UPDATE LOGIC ----------------------
  // uses the currentRecord in the timer tab as a base to update time, place, and bib with the next record, or to clear info for the next display
  async function updateTimeAndPlace({prevTime: prevTime, prevPlace: prevPlace, bib: bib}) {
    let updatedRecord = { ...currentRecord };
    // create and update copy to avoid bugging react useState
    updatedRecord = { ...currentRecord,
      place: prevPlace ?? props.place,
      timeRaw: prevTime ?? time,
      bib: bib ?? currentRecord?.bib
    };
    setCurrentRecord(updatedRecord);
    props.update(updatedRecord);
  }

  // uses entered bib number to fetch the racer record and display their name in the timer
  // if bib not found, displays "Not Found" as racer name
  async function fetchAndSetRecord(newBib) {
    const newRecord = await props.fetchRecord(parseInt(newBib))
    if (newRecord) {
      setCurrentRecord(newRecord);
      setFName(newRecord.fName);
      setLName(newRecord.lName);
    } else {
      // temporarily set id as bib number until backend is hooked up
      setCurrentRecord({
        id: newBib,
        place: props.place,
        bib: newBib,
        timeRaw: time,
        fName: "",
        lName: "Not Found"
      });
      setFName("");
      setLName("Not Found");
    }
  }

  function reset() {
    setBibNum(null);
    setFName(null);
    setLName(null);
  }

  function handleClick(event) {
    var target = event.target;
    if (target.value) {
      const updatedBibNum = (bibNum !== null) ? bibNum + target.value : target.value;
      setBibNum(parseInt(updatedBibNum));
      fetchAndSetRecord(parseInt(updatedBibNum));
    } else if (target.id === "start-record-button" && props.buttonText === "Start") {
      props.setButtonText("Record");
      props.startTimer();
    } else if (target.id === "start-record-button" && !checkIsPresent({ array: props.records, target: bibNum, type: "bib" })) {
      updateTimeAndPlace({prevTime: null, prevPlace: null, bib: null});
      reset();
      props.setPlace(prev => prev + 1);
    } else if (target.id === "start-record-button" && checkIsPresent({ array: props.records, target: bibNum, type: "bib" })) {
      // TODO: give user feedback
      console.warn("user already recorded")
      reset();
    } else if (target.id === "clear-button") {
      reset();
    } else if (target.id === "same-time-button") {
      const lastRecord = props.records.at(-1);
      updateTimeAndPlace({prevTime: lastRecord.timeRaw, prevPlace: lastRecord.place, bib: bibNum});
      reset();
      props.setPlace(prev => prev + 1);
    }
  }

  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: {hour}:{min}:{sec}:{milli}</h4>
        <h4>Place: {props.place}</h4>
        <h4>Bib #: {bibNum}</h4>
        <h4>Name: {fName && lName ? `${fName} ${lName}` : bibNum ? "Not Found" : ""}</h4>
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
        <button onClick={handleClick} id="start-record-button" className="timer-button timer-btn-color">{props.buttonText}</button>
      </div>
    </div>
  );
}

export default Timer;
