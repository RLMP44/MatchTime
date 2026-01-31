import Popup from "./Popup";
import { useState } from "react";

function RacerDisplay(props) {
  const [isDisplayed, setIsDisplayed] = useState("none");
  function handlePopUp() {
    setIsDisplayed(isDisplayed === "none" ? "" : "none");
  }
  const racerAttributes = ['bib#', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'race#', 'division'];
  const buttonTypes = ['cancel', 'save', 'done'];

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
          type={"Edit Racer"}
          fields={racerAttributes}
          buttons={buttonTypes}
          addRacer={props.addRacer}
          editRacer={props.editRacer}
          deleteRacer={props.deleteRacer}
        />
      </div>
    </div>
  );
}

export default RacerDisplay;
