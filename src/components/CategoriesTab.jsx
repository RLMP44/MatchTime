import { useState } from "react";
import Display from "./shared/Display";
import ButtonBar from "./shared/ButtonBar";

function CategoriesTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const headers = ['category', 'raceNo', 'handicap'];
  const editButtonTypes = ['cancel', 'update', 'delete'];
  const categoryFields = ['category', 'handicap', 'raceNo', 'sex', 'plusFive', 'plusTen'];

  const [popUpFields, setPopUpFields] = useState(categoryFields);
  const [buttonTypes, setButtonTypes] = useState(editButtonTypes);

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className="categories-tab">
      <div className="records-display-container categories-tab-record" onClick={handlePopUp}>
        <Display headers={headers} />
        {props.displayCategories.map(category =>
          <Display
            key={category.id}
            setIsDisplayed={setIsDisplayed}
            headers={headers}
            data={category}
            tab={props.tab}
            crud={'edit'}
            popUpFields={categoryFields}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            edit={props.edit}
            delete={props.delete}
          />
        )}
      </div>

      <ButtonBar
        tab={props.tab}
        add={props.add}
        setButtonTypes={setButtonTypes}
        buttons={buttonTypes}
        popUpFields={popUpFields}
        setPopUpFields={setPopUpFields}
      />
    </div>
  );
}

export default CategoriesTab;
