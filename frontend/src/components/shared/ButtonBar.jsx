import { useState } from "react";
import { pluralize } from "../../utils/helpers";
import Popup from "./popup/Popup";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function ButtonBar(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [popUpFields, setPopUpFields] = useState([]);
  const [buttonTypes, setButtonTypes] = useState([]);
  const [crud, setCrud] = useState([]);

  function getCrud(button) {
    return button.split('-')[0];
  }

  function handlePopUp(event) {
    const button = event.currentTarget.id;
    const selectedCrud = getCrud(button);
    if (props.tab === "result" && selectedCrud != "export") { return }
    setCrud(selectedCrud);
    setButtonTypes((props.tab === 'category' && selectedCrud === 'add')
      ? ['cancel', selectedCrud, 'done']
      : ['cancel', selectedCrud]
    );
    setPopUpFields(selectedCrud === 'add'
      ? props.fieldsObj[props.tab]
      : Object.keys(props.fieldsObj[selectedCrud])
    );
    setIsDisplayed(!isDisplayed);
  };

  return (
    <div>
      <div className={`buttons-bar ${props.tab}-bar`}>
        <button id='import-btn' className="button-bar-btn" aria-label={`Import`} onClick={handlePopUp}><FileDownloadIcon /></button>
        <button id='add-btn' className="button-bar-btn" aria-label={`Add ${props.tab}`} onClick={handlePopUp}><AddCircleIcon /></button>
        <button id='export-btn' className="button-bar-btn" aria-label={`Export`} onClick={handlePopUp}><FileUploadIcon /></button>
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          tab={props.tab}
          crud={crud}
          add={props.add}
          import={props.import}
          buttons={buttonTypes}
          categories={props.categories}
          divisions={props.divisions}
          popUpFields={popUpFields}
          fieldsObj={props.fieldsObj}
        />
      </div>
    </div>
  );
}

export default ButtonBar;
