import { useState, useEffect, useCallback } from "react";
import { checkIsPresent, range, prepTimeForDisplay, titleize } from "../../utils/helpers";

function Timer(props) {
  const { timeInMs, startTimer } = props.timer;
  const [displayTime, setDisplayTime] = useState({
    hour: "HH",
    min: "MM",
    sec: "SS",
    milli: "mm"
  });

  useEffect(() => {
    setDisplayTime(() => {
      const { padHours, padMins, padSeconds, padMillis } = prepTimeForDisplay(timeInMs);
      return { hour: padHours, min: padMins, sec: padSeconds, milli: padMillis };
    });
  }, [timeInMs]);

  const [bibNum, setBibNum] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  let fName = currentRecord?.fName ?? null;
  let lName = currentRecord?.lName ?? null;
  const timerNums = range(1, 9);
  const {
    update,
    place,
    setPlace,
    fetchRecord,
    buttonText,
    setButtonText,
    records
  } = props;


  // ---------------------- UPDATE LOGIC ----------------------
  // uses the currentRecord in the timer tab as a base to update time, place,
  // and bib with the next record, or to clear info for the next display
  // useCallback to rerender only when dependencies update
  const updateTimeAndPlace = useCallback(
    ({ prevTime, prevPlace, bib }) => {
      const updatedRecord = {
        ...currentRecord,
        place: prevPlace ?? place,
        timeRaw: prevTime ?? timeInMs,
        bib: bib ?? currentRecord?.bib
      };

      setCurrentRecord(updatedRecord);
      update(updatedRecord);
    },
    [currentRecord, update, place, timeInMs]
  );

  // uses entered bib # to fetch racer record and display name in timer
  // if bib not found, displays "Not Found" as racer name
  const fetchAndSetRecord = useCallback(
    async (newBib) => {
      const parsedBib = parseInt(newBib);
      const newRecord = await fetchRecord(parsedBib)
      if (newRecord) {
        setCurrentRecord(newRecord);
      } else {
        // temporarily set id as bib number +1 until backend is hooked up
        setCurrentRecord({
          id: parsedBib + 1,
          place: place,
          bib: parsedBib,
          timeRaw: timeInMs,
          fName: "",
          lName: "Not Found"
        });
      }
    }, [fetchRecord, place, timeInMs]
  );

  // resets names & bib # displayed next to timer
  // useCallback to prevent unnecessary rerendering, esp when passed to children
  const reset = useCallback(() => {
    setCurrentRecord(null);
    setBibNum(null);
  }, []);

  const handleClick = useCallback(
    (event) => {
      var target = event.target;
      var value = target.value;
      const isStartRecordButton = target.id === "start-record-button";
      const isClearButton = target.id === "clear-button";
      const isSameTimeButton = target.id === "same-time-button";

      const racerAlreadyRecorded = isStartRecordButton || isSameTimeButton
        && checkIsPresent({ array: records, target: bibNum, type: "bib" });
      const recordNewRacer = isStartRecordButton && bibNum !== null
        && !checkIsPresent({ array: records, target: bibNum, type: "bib" });
      const noRacerSelected = isStartRecordButton
        && !bibNum && buttonText === "record";
      const shouldStartTimer = isStartRecordButton
        && buttonText === "start";

      if (value && !isNaN(value)) {
        const updated = bibNum !== null ? bibNum + value : value;
        const parsed = parseInt(updated);
        setBibNum(parsed);
        fetchAndSetRecord(parsed);
        return;
      }

      if (shouldStartTimer) {
        setButtonText("record");
        startTimer();
        return;
      };

      if (noRacerSelected) {
        return;
      };

      if (recordNewRacer) {
        updateTimeAndPlace({
          prevTime: null,
          prevPlace: null,
          bib: null
        });
        reset();
        setPlace(prev => prev + 1);
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
        const lastRecord = records.at(-1);
        if (lastRecord) {
          updateTimeAndPlace({
            prevTime: lastRecord?.timeRaw,
            prevPlace: lastRecord?.place,
            bib: bibNum
          });
          reset();
          setPlace(prev => prev + 1);
        };
        return;
      };
    },
    [ // dependencies
      bibNum,
      fetchAndSetRecord,
      reset,
      records,
      updateTimeAndPlace,
      setPlace,
      buttonText,
      setButtonText,
      startTimer
    ]
  );

  return (
    <div className="timer-display">
      <div className="timer-info-display">
        <h4>Time: {displayTime.hour}:{displayTime.min}:{displayTime.sec}:{displayTime.milli}</h4>
        <h4>Place: {props.place}</h4>
        <h4>Bib #: {bibNum}</h4>
        <h4>Name: {fName && lName ? `${fName} ${lName}` : bibNum ? "Not Found" : ""}</h4>
      </div>
      <div className="timer-buttons-container">
        {timerNums.map((num) =>
          <button key={num} onClick={handleClick} id={`button-${num}`} className="timer-button timer-btn-reg" value={num}>{num}</button>
        )}
        <button onClick={handleClick} id="same-time-button" className="timer-button timer-btn-color">Same<br></br>Time</button>
        <button onClick={handleClick} id="button-0" className="timer-button timer-btn-reg" value="0">0</button>
        <button onClick={handleClick} id="clear-button" className="timer-button timer-btn-color">Clear</button>
        <button onClick={handleClick} id="start-record-button" className="timer-button timer-btn-color">{titleize(props.buttonText)}</button>
      </div>
    </div>
  );
}

export default Timer;
