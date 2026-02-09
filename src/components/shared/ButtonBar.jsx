import { useState } from "react";
import Popup from "./Popup";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ButtonBar(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const importExportFields = ['times', 'categories', 'racers', 'clear existing', 'merge', 'filename'];

  function getCrud(button) {
    return button.split('-')[0];
  }

  function handlePopUp(event) {
    const button = event.currentTarget.id;
    const selectedCrud = getCrud(button);
    props.setCrud(selectedCrud);
    props.setButtonTypes(['cancel', selectedCrud]);
    if (button === 'import-btn' || button === 'export-button') {
      props.setPopUpFields(importExportFields);
    }
    setIsDisplayed(!isDisplayed);
  };

  return (
    <div>
      <div className={`buttons-bar ${props.tab}-bar`}>
        <button id='import-btn' className={`${props.tab}-tab-btn`} alt={`Import ${props.tab}`} onClick={handlePopUp}><FileDownloadIcon /></button>
        <button id='add-btn' className={`${props.tab}-tab-btn`} alt={`Add ${props.tab}`} onClick={handlePopUp}><AddCircleIcon /></button>
        <button id='export-btn' className={`${props.tab}-tab-btn`} alt={`Export ${props.tab}`} onClick={handlePopUp}><FileUploadIcon /></button>
      </div>
      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          tab={props.tab}
          crud={props.crud}
          addRacer={props.addRacer}
          buttons={props.buttons}
          popUpFields={props.popUpFields}
          setPopUpFields={props.setPopUpFields}
        />
      </div>
    </div>
  );
}

export default ButtonBar;
