import { useState, useEffect, useCallback } from "react";
import { checkIsPresent, range, prepTimeForDisplay, titleize } from "../../utils/helpers";
import { ToastContainer, toast, Bounce } from 'react-toastify';

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
  let first_name = currentRecord?.first_name ?? null;
  let last_name = currentRecord?.last_name ?? null;
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
  const handleRecordRacer = useCallback(
    async ({ prevTime, prevPlace, bib }) => {
      const updatedRecord = {
        ...currentRecord,
        place: prevPlace ?? place,
        time_raw: prevTime ?? timeInMs,
        bib: bib ?? currentRecord?.bib
      };

      const updated = await update({ oldRecord: currentRecord, newRecord: updatedRecord });
      setCurrentRecord(updated);
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
          time_raw: timeInMs,
          first_name: "",
          last_name: "Not Found"
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
      const noRacerSelected = isStartRecordButton && buttonText === "record"
        && !last_name || !bibNum;
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
        toast("No racer selected!");
        return;
      };

      if (recordNewRacer) {
        handleRecordRacer({
          prevTime: null,
          prevPlace: null,
          bib: null
        });
        reset();
        setPlace(prev => prev + 1);
        return;
      };

      if (racerAlreadyRecorded) {
        toast("Racer already recorded!")
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
          handleRecordRacer({
            prevTime: lastRecord?.time_raw,
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
      last_name,
      fetchAndSetRecord,
      reset,
      records,
      handleRecordRacer,
      setPlace,
      buttonText,
      setButtonText,
      startTimer
    ]
  );

  return (
    <div className="timer-display">
      <div data-testid="timer-info-display" className="timer-info-display">
        <h4 data-testid="display-timer">Time: {displayTime.hour}:{displayTime.min}:{displayTime.sec}:{displayTime.milli}</h4>
        <h4>Place: {props.place}</h4>
        <h4>Bib #: {bibNum}</h4>
        <h4>Name: {first_name && last_name ? `${first_name} ${last_name}` : bibNum ? "Not Found" : ""}</h4>
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
