import { useState } from "react";
import Popup from "./shared/Popup";
import ButtonBar from "./shared/ButtonBar";

function CategoriesTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const editButtonTypes = ['cancel', 'update', 'delete'];
  const categoryFields = ['name', 'handicap', 'raceNo', 'sex', 'plusFive', 'plusTen'];

  const [crud, setCrud] = useState('');
  const [popUpFields, setPopUpFields] = useState(categoryFields);
  const [buttonTypes, setButtonTypes] = useState([]);

  function handlePopUp() {
    setCrud("edit");
    setIsDisplayed(!isDisplayed);
    setButtonTypes(!isDisplayed ? editButtonTypes : []);
  }

  return (
    <div className="categories-tab">
      <div className="records-display-container categories-tab-record" onClick={handlePopUp}>
        <div>
          <div className="record-container">
            <p><strong>Category</strong></p>
            <p><strong>Race #</strong></p>
            <p><strong>Handicap</strong></p>
          </div>
        </div>
        {props.displayCategories.map((cat) => {
          return (
            <div key={cat.id} >
              <div className="record-container" onClick={handlePopUp}>
                <p>{cat.name}</p>
                <p>{cat.raceNo}</p>
                <p>{cat.handicap}</p>
              </div>
            </div>
          );
        })}
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
