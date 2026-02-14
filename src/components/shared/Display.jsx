import Popup from "../shared/Popup";
import { useState } from "react";

function Display(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  console.log(props.data)

  function handlePopUp() {
    props.setCrud("edit")
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div>
      <div className="display-container display-record" onClick={handlePopUp}>
        { props.headers && props.headers.map((header) => {
          return <p><strong>{header}</strong></p>
        })}
        { (props.data && Object.keys(props?.data).length > 0) && Object.keys(props.data).map((key) => {
          return key !== 'id' && <p>{ props?.data[key] }</p>
        })}
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          setCrud={props.setCrud}
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

export default Display;
