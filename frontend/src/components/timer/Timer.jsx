import { useState, useEffect } from "react";
import { checkIsPresent, range, prepTimeForDisplay } from "../../utils/helpers";
import TimerButton from "./TimerButton";

function Timer(props) {
  const [timeInMs, setTimeInMs] = useState(0);
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
      setTimeInMs(timeElapsed);
      const { padHours, padMins, padSeconds, padMillis } = prepTimeForDisplay(timeElapsed);

      setHour(padHours);
      setMin(padMins);
      setSec(padSeconds);
      setMilli(padMillis);
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
      timeRaw: prevTime ?? timeInMs,
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
        timeRaw: timeInMs,
        fName: "",
        lName: "Not Found"
      });
      setFName("");
      setLName("Not Found");
    }
  }

  // resets names and bib # displayed next to timer
  function reset() {
    setBibNum(null);
    setFName(null);
    setLName(null);
  }

  function handleClick(event) {
    var target = event.target;
    var value = target.value;
    const isStartRecordButton = target.id === "start-record-button";
    const isClearButton = target.id === "clear-button";
    const isSameTimeButton = target.id === "same-time-button";

    const racerAlreadyRecorded = isStartRecordButton
      && checkIsPresent({ array: props.records, target: bibNum, type: "bib" });
    const recordNewRacer = isStartRecordButton
      && !checkIsPresent({ array: props.records, target: bibNum, type: "bib" });
    const noRacerSelected = isStartRecordButton
      && !bibNum && props.buttonText === "record";
    const startTimer = isStartRecordButton
      && props.buttonText === "start"

    if (value && !isNaN(value)) {
      const updated = bibNum !== null ? bibNum + value : value;
      const parsed = parseInt(updated);
      setBibNum(parsed);
      fetchAndSetRecord(parsed);
      return;
    }

    if (startTimer) {
      props.setButtonText("record");
      props.startTimer();
      return;
    };

    if (noRacerSelected) {
      return;
    };

    if (recordNewRacer) {
      updateTimeAndPlace({
        prevTime: null,
        prevTimeInMs: null,
        prevPlace: null,
        bib: null
      });
      reset();
      props.setPlace(prev => prev + 1);
      return;
    };

    if (racerAlreadyRecorded) {
      // TODO: give user feedback
      console.warn("user already recorded")
      reset();
      return;
    };

    if (isClearButton) {
      reset();
      return;
    };

    if (isSameTimeButton) {
      const lastRecord = props.records.at(-1);
      if (lastRecord) {
        updateTimeAndPlace({
          prevTime: lastRecord?.timeRaw,
          prevPlace: lastRecord?.place,
          bib: bibNum
        });
        reset();
        props.setPlace(prev => prev + 1);
      };
      return;
    };
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
