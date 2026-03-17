import { useState, useEffect, useCallback } from "react";
import { checkIsPresent, range, prepTimeForDisplay } from "../../utils/helpers";
import TimerButton from "./TimerButton";

function Timer(props) {
  const [timeInMs, setTimeInMs] = useState(0);
  const [displayTime, setDisplayTime] = useState({
    hour: "HH",
    min: "MM",
    sec: "SS",
    milli: "mm"
  })

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
    records,
    startTimer
  } = props;
  // set callback for timer to avoid starting it on render


  // ---------------------- TIMER LOGIC ----------------------
  useEffect(() => {
    if (!props.timerOn) return;

    const interval = setInterval(() => {
      // performance.now() is the most accurate and can keep calculating in background
      const timeElapsed = (performance.now() - props.startTime);
      setTimeInMs(timeElapsed);
      const { padHours, padMins, padSeconds, padMillis } = prepTimeForDisplay(timeElapsed);

      setDisplayTime({
        hour: padHours,
        min: padMins,
        sec: padSeconds,
        milli: padMillis
      })
      // update timer loop at 30 Hz (30 updates per second)
    }, 30);

    return () => clearInterval(interval);
  }, [props.timerOn, props.startTime]);


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
        // temporarily set id as bib number until backend is hooked up
        setCurrentRecord({
          id: parsedBib,
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

      const racerAlreadyRecorded = isStartRecordButton
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
