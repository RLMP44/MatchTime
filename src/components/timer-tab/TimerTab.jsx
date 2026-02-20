import { useState } from "react";
import Timer from "./Timer";
import Display from "../shared/Display";

function TimerTab(props) {
  let [isDisplayed, setIsDisplayed] = useState(false);
  const headers = ['place', 'bib', 'time', 'lName', 'fName'];

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className="timer-tab">
      <div className="records-display-container" onClick={handlePopUp}>
        <Display headers={headers} />
        {props.timerDisplayRecords.map(record =>
          <Display
            key={record.id}
            headers={headers}
            data={record}
            tab={props.tab}
            edit={props.edit}
            fetchRecord={props.fetchRecord}
            delete={props.delete}
          />)}
      </div>

      <Timer
        place={props.place}
        setPlace={props.setPlace}
        buttonText={props.buttonText}
        setButtonText={props.setButtonText}
        timerOn={props.timerOn}
        setTimerOn={props.setTimerOn}
        startTime={props.startTime}
        setStartTime={props.setStartTime}
        startTimer={props.startTimer}
        update={props.update}
        fetchRecord={props.fetchRecord}
        timerDisplayRecords={props.timerDisplayRecords}
        />
    </div>
  );
}

export default TimerTab;
