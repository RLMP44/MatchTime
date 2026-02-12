import { useState } from "react";
import Popup from "./shared/Popup";
import ButtonBar from "./shared/ButtonBar";

function CategoriesTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const editButtonTypes = ['cancel', 'add'];
  const categoryFields = ['name', 'handicap', 'sex', 'plusFive', 'plusTen'];

  const [crud, setCrud] = useState('');
  const [popUpFields, setPopUpFields] = useState(categoryFields);
  const [buttonTypes, setButtonTypes] = useState(editButtonTypes);

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className="categories-tab">
      <div className="record-container racer-tab-record" onClick={handlePopUp}>
        <p>Category</p>
        <p>Race #</p>
        <p>Handicap</p>
      </div>

      {/* ------------- POPUP ------------- */}
      <div style={{display: isDisplayed ? "" : "none"}}>
        <Popup
          setIsDisplayed={setIsDisplayed}
          data={props.data}
          tab={props.tab}
          crud={crud}
          popUpFields={categoryFields}
          buttons={buttonTypes}
          editCategory={props.editCategory}
          deleteCategory={props.deleteCategory}
        />
      </div>
      <ButtonBar
        tab={props.tab}
        crud={crud}
        setCrud={setCrud}
        addCategory={props.addCategory}
        setButtonTypes={setButtonTypes}
        buttons={buttonTypes}
        popUpFields={popUpFields}
        setPopUpFields={setPopUpFields}
      />
    </div>
  );
}

export default CategoriesTab;
