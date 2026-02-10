import { useState } from "react";
import Popup from "../shared/Popup";

function RecordDisplay(props) {
  let [isDisplayed, setIsDisplayed] = useState(false);
  const [time, setTime] = useState(props?.data?.time || "");
  const [bibNum, setBibNum] = useState(props?.data?.bib || "");
  const fields = ['bib', 'time'];
  const editButtonTypes = ['cancel', 'update', 'delete'];

  function handlePopUp() {
    props.setCrud("edit")
    props.setPopUpFields(fields);
    setIsDisplayed(!isDisplayed);
    props.setButtonTypes(editButtonTypes);
  }

  return (
    <div>
      <div className="record-container" onClick={handlePopUp}>
        <p>{props.data.place}</p>
        <p>{props.data.bib}</p>
        <p>{props.data.time}</p>
        <p>{props.data.fName} {props.data.lName}</p>
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          data={props.data}
          tab={props.tab}
          crud={props.crud}
          time={time}
          setTime={setTime}
          bibNum={bibNum}
          setBibNum={setBibNum}
          popUpFields={props.popUpFields}
          setPopUpFields={props.setPopUpFields}
          buttons={props.buttonTypes}
          setButtonTypes={props.setButtonTypes}
          addRacer={props.addRacer}
          editRacer={props.editRacer}
          deleteRacer={props.deleteRacer}
          editRecords={props.editRecords}
          fetchRecord={props.fetchRecord}
          deleteDisplayedRecord={props.deleteDisplayedRecord}
        />
      </div>
    </div>
  );
}

export default RecordDisplay;
