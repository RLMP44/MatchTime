import Popup from "./Popup";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Display(props) {
  const { t } = useTranslation();
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [buttonTypes, setButtonTypes] = useState([]);
  const [crud, setCrud] = useState([]);

  const shouldDisplayData = props.data && Object.keys(props?.data).length > 0;
  const editButtonTypes = ['cancel', 'update', 'delete'];
  const displayData = transformData(props.data);
  // useState to set up headers BEFORE first render to avoid flash on screen
  const [updatedHeaders] = useState(() => {
    if (!props.headers) { return [] };
    const hasNameField = props.headers.includes('fName') ||
      props.headers.includes('lName');

    if (hasNameField) {
      return props.headers
        .filter(header => header !== 'fName' && header !== 'lName')
        .concat('name');
    }
    return props.headers
  });

  // updates data to display "last name, first name" if names present in headers
  function transformData(data) {
    if (!data) return null;
    const { fName, lName, ...other } = data;

    if (fName || lName) {
      return { ...other, name: `${lName}, ${fName}` };
    }
    return data;
  };

  function handlePopUp() {
    if (props.tab === "result") { return };
    setIsDisplayed(!isDisplayed);
    setButtonTypes(editButtonTypes);
    setCrud('edit');
  };


  return (
    <div>
      <div key={props.tab} className={`display-container ${props.tab}-display-grid`} onClick={handlePopUp}>
        {updatedHeaders.map((header) => (
          <p id={header} key={header}>{
            shouldDisplayData ? (displayData[header] ?? ""): <strong>{t(`${header}`)}</strong>
            }
          </p>
        ))}
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          data={props.data}
          tab={props.tab}
          crud={crud}
          popUpFields={props.fields}
          buttons={buttonTypes}
          setButtonTypes={setButtonTypes}
          setDisplayRecords={props.setDisplayRecords}
          fetchRecord={props.fetchRecord}
          edit={props.edit}
          delete={props.delete}
        />
      </div>
    </div>
  );
}

export default Display;
