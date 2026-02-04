import Popup from "../shared/Popup";
import { useState } from "react";

function RacerDisplay(props) {
  const racerAttributes = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const [isDisplayed, setIsDisplayed] = useState("none");
  const editButtonTypes = ['cancel', 'update', 'delete'];

  function handlePopUp() {
    props.setCrud("Edit")
    setIsDisplayed(isDisplayed === "none" ? "" : "none");
    props.setButtonTypes(isDisplayed === "none" ? editButtonTypes : []);
  }

  return (
    <div>
      <div className="record-container racer-tab-record" onClick={handlePopUp}>
        <p>{ props.data ? props.data.bib : <strong>Bib #</strong>}</p>
        <p>{ props.data ? `${props.data.fName} ${props.data.lName}` : <strong>Name</strong>}</p>
        <p>{ props.data ? props.data.division : <strong>Division</strong>}</p>
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          data={props.data}
          tab={props.tab}
          crud={props.crud}
          fields={racerAttributes}
          buttons={props.buttons}
          setButtonTypes={props.setButtonTypes}
          addRacer={props.addRacer}
          editRacer={props.editRacer}
          deleteRacer={props.deleteRacer}
        />
      </div>
    </div>
  );
}

export default RacerDisplay;
