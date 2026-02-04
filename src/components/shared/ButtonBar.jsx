import { useState } from "react";
import Popup from "./Popup";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ButtonBar(props) {
  const [isDisplayed, setIsDisplayed] = useState("none");

  function handlePopUp(event) {
    const button = event.currentTarget.id;
    if (button === 'add-btn') {
      console.log('here')
      props.setCrud("Add");
      props.setButtonTypes(['cancel', 'add', 'done']);
    } else if (button === 'import-btn') {
      props.setCrud("Import");
      props.setButtonTypes(['cancel', 'import', 'done']);
    } else if (button === 'export-btn') {
      props.setCrud("Export");
      props.setButtonTypes(['cancel', 'export', 'done']);
    };
    setIsDisplayed(isDisplayed === "none" ? "" : "none");
  };

  return (
    <div>
      <div className={`buttons-bar ${props.tab}-bar`}>
        <button id='import-btn' className={`${props.tab}-tab-btn`} alt={`Import ${props.tab}`} onClick={handlePopUp}><FileDownloadIcon /></button>
        <button id='add-btn' className={`${props.tab}-tab-btn`} alt={`Add ${props.tab}`} onClick={handlePopUp}><AddCircleIcon /></button>
        <button id='export-btn' className={`${props.tab}-tab-btn`} alt={`Export ${props.tab}`} onClick={handlePopUp}><FileUploadIcon /></button>
      </div>
      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          tab={props.tab}
          crud={props.crud}
          addRacer={props.addRacer}
          buttons={props.buttons}
          fields={props.fields}
        />
      </div>
    </div>
  );
}

export default ButtonBar;
