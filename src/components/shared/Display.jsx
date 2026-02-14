import Popup from "../shared/Popup";
import { useState } from "react";

function Display(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const shouldDisplayData = props.data && Object.keys(props?.data).length > 0;

  function handlePopUp() {
    props.setCrud("edit")
    setIsDisplayed(!isDisplayed);
  };

  // checks the incoming fields and only displays those matching provided headers
  function checkShouldDisplayField(key) {
    return key !== 'id' && props?.headers.includes(key);
  };

  function setHeaders(headers) {
    return headers.map((header) => {
      return <p><strong>{header}</strong></p>
    });
  };

  function setDisplayData(data) {
    return Object.keys(data).map((key) => {
      return checkShouldDisplayField(key) && <p>{ data[key] }</p>
    });
  };


  return (
    <div>
      <div className="display-container display-record" onClick={handlePopUp}>
        { !props.data && setHeaders(props.headers) }
        { shouldDisplayData && setDisplayData(props.data) }
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
          editCategory={props.editCategory}
          deleteCategory={props.deleteCategory}
          addRacer={props.addRacer}
          editRacer={props.editRacer}
          deleteRacer={props.deleteRacer}
        />
      </div>
    </div>
  );
}

export default Display;
