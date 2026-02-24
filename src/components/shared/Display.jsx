import Popup from "../shared/Popup";
import { useState } from "react";

function Display(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [buttonTypes, setButtonTypes] = useState([]);
  const [crud, setCrud] = useState([]);

  const shouldDisplayData = props.data && Object.keys(props?.data).length > 0;
  const editButtonTypes = ['cancel', 'update', 'delete'];

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
    setButtonTypes(editButtonTypes);
    setCrud('edit');
  };

  // checks the incoming fields and only displays those matching provided headers
  function checkShouldDisplayField(key) {
    return key !== 'id' && props?.headers.includes(key);
  };

  function setHeaders(headers) {
    return headers.map((header) => {
      return <p key={header}><strong>{header}</strong></p>
    });
  };

  // .filter always does callback(element, index, array), so variable is automatically passed in .filter
  function setDisplayData(data) {
    return Object.keys(data).filter(checkShouldDisplayField).map((key) => {
      return <p key={key}>{ data[key] }</p>
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
