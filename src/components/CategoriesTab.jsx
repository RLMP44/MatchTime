import { useState } from "react";
import Display from "./shared/Display";
import ButtonBar from "./shared/ButtonBar";

function CategoriesTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const headers = ['Category', 'Race #', 'Handicap'];
  const editButtonTypes = ['cancel', 'update', 'delete'];
  const categoryFields = ['name', 'handicap', 'raceNo', 'sex', 'plusFive', 'plusTen'];

  console.log(props.displayCategories[1])
  console.log(Object.keys(props.displayCategories[1]))
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
        <Display headers={headers} />
        {props.displayCategories.map(category =>
          <Display
            key={category.id}
            setIsDisplayed={setIsDisplayed}
            data={category}
            tab={props.tab}
            crud={crud}
            setCrud={setCrud}
            popUpFields={categoryFields}
            buttons={buttonTypes}
            editCategory={props.editCategory}
            deleteCategory={props.deleteCategory}
          />
        )}
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
