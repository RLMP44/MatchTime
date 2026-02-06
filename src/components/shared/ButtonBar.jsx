import { useState } from "react";
import Popup from "./Popup";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ButtonBar(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const racerAttributes = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const importExportFields = ['times', 'categories', 'racers', 'clear existing', 'merge', 'filename'];


  function handlePopUp(event) {
    const button = event.currentTarget.id;
    if (button === 'add-btn') {
      props.setCrud("Add");
      props.setButtonTypes(['cancel', 'add']);
      props.setPopUpFields(racerAttributes);
    } else if (button === 'import-btn') {
      props.setCrud("Import");
      props.setButtonTypes(['cancel', 'import']);
      props.setPopUpFields(importExportFields);
    } else if (button === 'export-btn') {
      props.setCrud("Export");
      props.setButtonTypes(['cancel', 'export']);
      props.setPopUpFields(importExportFields);
    };
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
