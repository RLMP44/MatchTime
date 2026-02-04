import { useState } from "react";
import Timer from "./Timer";
import RecordDisplay from "./RecordDisplay";

function TimerTab(props) {
  const [crud, setCrud] = useState('');
  const [popUpFields, setPopUpFields] = useState([]);
  const [buttonTypes, setButtonTypes] = useState([]);

  return (
    <div className="timer-tab">
      <div className="records-display-container">
        <div className="record-container">
          <p><strong>Place</strong></p>
          <p><strong>Bib #</strong></p>
          <p><strong>Time</strong></p>
          <p><strong>Name</strong></p>
        </div>
        {props.timerDisplayRecords.map(record =>
          <RecordDisplay
            key={record.id}
            data={record}
            tab={props.tab}
            crud={crud}
            buttonTypes={buttonTypes}
            setButtonTypes={setButtonTypes}
            popUpFields={popUpFields}
            setPopUpFields={setPopUpFields}
            setCrud={setCrud}
            editRecords={props.editRecords}
            fetchRecord={props.fetchRecord}
            deleteRecord={props.deleteRecord}
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
        updateUserRecord={props.updateUserRecord}
        fetchRecord={props.fetchRecord}
        timerDisplayRecords={props.timerDisplayRecords}
        />
    </div>
  );
}

export default TimerTab;
