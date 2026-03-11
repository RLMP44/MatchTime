import { useState, useEffect } from "react";
import { checkIsPresent, range } from "../utils/helpers";
import TimerButton from "./TimerButton";

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

  const timerNums = range(1, 9);


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
    } else if (target.id === "start-record-button" && props.buttonText === "start") {
      props.setButtonText("record");
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
      if (lastRecord) {
        updateTimeAndPlace({prevTime: lastRecord?.timeRaw, prevPlace: lastRecord?.place, bib: bibNum});
        reset();
        props.setPlace(prev => prev + 1);
      };
    }
  };

  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: {hour}:{min}:{sec}:{milli}</h4>
        <h4>Place: {props.place}</h4>
        <h4>Bib #: {bibNum}</h4>
        <h4>Name: {fName && lName ? `${fName} ${lName}` : bibNum ? "Not Found" : ""}</h4>
      </div>
      <div className="timer-buttons-container">
        {timerNums.map((num) =>
          <TimerButton
            key={num}
            value={num}
            type={'reg'}
            onClick={handleClick}
          />
        )}
        <TimerButton
          key={'same-time'}
          value={'same-time'}
          label={'Same Time'}
          type={'color'}
          onClick={handleClick}
        />
        <TimerButton
          key={0}
          value={0}
          type={'reg'}
          onClick={handleClick}
        />
        <TimerButton
          key={'clear'}
          value={'clear'}
          label={'Clear'}
          type={'color'}
          onClick={handleClick}
        />
        <TimerButton
          key={'start-record'}
          value={'start-record'}
          label={props.buttonText}
          type={'color'}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default Timer;
