import { useState } from "react";
import Display from "./Display";
import ButtonBar from "./ButtonBar";
import Timer from "../Timer";

function Tab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className={`tab ${props.tab}-tab`}>
      <div className="records-display-container" onClick={handlePopUp}>
        <Display headers={props.headers} tab={props.tab} />
        {props.records.map(record =>
          <Display
            key={record.id}
            headers={props.headers}
            fields={props.fields}
            setIsDisplayed={setIsDisplayed}
            data={record}
            tab={props.tab}
            setDisplayRecords={props.setDisplayRecords}
            fetchRecord={props.fetchRecord}
            edit={props.edit}
            delete={props.delete}
          />
        )}
      </div>
      {props.tab === 'timer' && <Timer
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
                                  records={props.records}
                                />
      }
      {props.tab !== 'timer' && <ButtonBar
                                  tab={props.tab}
                                  add={props.add}
                                  fieldsObj={props.fieldsObj}
                                />
      }
    </div>
  );
}

export default Tab;
