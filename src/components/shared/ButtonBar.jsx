import { useState } from "react";
import { pluralize } from "../../utils/helpers";
import Popup from "./Popup";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ButtonBar(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [popUpFields, setPopUpFields] = useState([]);
  const [buttonTypes, setButtonTypes] = useState([]);
  const [crud, setCrud] = useState([]);

  const importExportFields = ['times', 'categories', 'racers', 'clear existing', 'merge', 'filename'];
  const racerFields = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const categoryFields = ['category', 'handicap', 'raceNo', 'sex', 'plusFive', 'plusTen'];

  function getCrud(button) {
    return button.split('-')[0];
  }

  function handlePopUp(event) {
    const button = event.currentTarget.id;
    const selectedCrud = getCrud(button);
    setCrud(selectedCrud);
    setButtonTypes(['cancel', selectedCrud]);
    if (button === 'import-btn' || button === 'export-btn') {
      setPopUpFields(importExportFields);
    } else if (props.tab === 'racers') {
      setPopUpFields(racerFields);
    } else if (props.tab === 'categories') {
      setPopUpFields(categoryFields);
    } else {
      setPopUpFields([]);
    }
    setIsDisplayed(!isDisplayed);
  };

  return (
    <div>
      <div className={`buttons-bar ${props.tab}-bar`}>
        <button id='import-btn' className="button-bar-btn" alt={`Import ${pluralize(props.tab)}`} onClick={handlePopUp}><FileDownloadIcon /></button>
        <button id='add-btn' className="button-bar-btn" alt={`Add ${props.tab}`} onClick={handlePopUp}><AddCircleIcon /></button>
        <button id='export-btn' className="button-bar-btn" alt={`Export ${pluralize(props.tab)}`} onClick={handlePopUp}><FileUploadIcon /></button>
      </div>
      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          tab={props.tab}
          crud={crud}
          add={props.add}
          buttons={buttonTypes}
          popUpFields={popUpFields}
        />
      </div>
    </div>
  );
}

export default ButtonBar;
