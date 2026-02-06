import Popup from "../shared/Popup";
import { useState } from "react";

function RacerDisplay(props) {
  const racerAttributes = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const [isDisplayed, setIsDisplayed] = useState(false);
  const editButtonTypes = ['cancel', 'update', 'delete'];

  function handlePopUp() {
    props.setCrud("Edit")
    props.setPopUpFields(racerAttributes);
    setIsDisplayed(!isDisplayed);
    props.setButtonTypes(!isDisplayed ? editButtonTypes : []);
  }

  return (
    <div>
      <div className="record-container racer-tab-record" onClick={handlePopUp}>
        <p>{ props.data ? props.data.bib : <strong>Bib #</strong>}</p>
        <p>{ props.data ? `${props.data.fName} ${props.data.lName}` : <strong>Name</strong>}</p>
        <p>{ props.data ? props.data.division : <strong>Division</strong>}</p>
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          data={props.data}
          tab={props.tab}
          crud={props.crud}
          popUpFields={props.popUpFields}
          setPopUpFields={props.setPopUpFields}
          buttons={props.buttons}
          setButtonTypes={props.setButtonTypes}
          setDisplayRecords={props.setDisplayRecords}
          addRacer={props.addRacer}
          editRacer={props.editRacer}
          deleteRacer={props.deleteRacer}
        />
      </div>
    </div>
  );
}

export default RacerDisplay;
