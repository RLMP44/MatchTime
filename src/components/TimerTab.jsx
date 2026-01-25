import Timer from "./Timer";
import RecordDisplay from "./RecordDisplay";

function TimerTab(props) {
  return (
    <div className="timer-tab">
      <div className="records-display-container">
        <RecordDisplay />
        {props.displayRecords.map(record =>
          <RecordDisplay
            key={record.id}
            data={record}
            editRecords={props.editRecords}
            fetchRecord={props.fetchRecord}
            deleteRecord={props.deleteRecord}
          />)}
      </div>
      <Timer
        updateUserRecord={props.updateUserRecord}
        fetchRecord={props.fetchRecord}
        displayRecords={props.displayRecords}
        />
    </div>
  );
}

export default TimerTab;
