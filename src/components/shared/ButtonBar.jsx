import { useState } from "react";
import Popup from "./Popup";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ButtonBar(props) {
  const [isDisplayed, setIsDisplayed] = useState("none");
  function handlePopUp() {
    setIsDisplayed(isDisplayed === "none" ? "" : "none");
  }

  return (
    <div>
      <div className={`buttons-bar ${props.tab}-bar`}>
        <button className={`${props.tab}-tab-btn`} alt="Import Racers"><FileDownloadIcon /></button>
        <button className={`${props.tab}-tab-btn`} alt="Add Racer" onClick={handlePopUp}><AddCircleIcon /></button>
        <button className={`${props.tab}-tab-btn`} alt="Export Racers"><FileUploadIcon /></button>
      </div>
      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          tab={props.tab}
          crud={"Add"}
          addRacer={props.addRacer}
          buttons={props.buttons}
          fields={props.fields}
        />
      </div>
    </div>
  );
}

export default ButtonBar;
