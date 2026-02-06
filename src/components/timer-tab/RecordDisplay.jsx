import { useState } from "react";
import Popup from "../shared/Popup";

function RecordDisplay(props) {
  let [isDisplayed, setIsDisplayed] = useState(false);
  const [time, setTime] = useState(props?.data?.time || "");
  const [bibNum, setBibNum] = useState(props?.data?.bib || "");
  const fields = ['bib', 'time'];
  const editButtonTypes = ['cancel', 'update', 'delete'];

  function handlePopUp() {
    props.setCrud("Edit")
    props.setPopUpFields(fields);
    setIsDisplayed(!isDisplayed);
    props.setButtonTypes(!isDisplayed ? editButtonTypes : []);
  }

  return (
    <div>
      <div className="record-container" onClick={handlePopUp}>
        <p>{ props.data ? props.data.place : <strong>Place</strong>}</p>
        <p>{ props.data ? props.data.bib : <strong>Bib #</strong>}</p>
        <p>{ props.data ? props.data.time : <strong>Time</strong>}</p>
        <p>{ props.data ? `${props.data.fName} ${props.data.lName}` : <strong>Name</strong>}</p>
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
          deleteRecord={props.deleteRecord}
        />
      </div>
    </div>
  );
}

export default RecordDisplay;
