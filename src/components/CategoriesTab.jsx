import { useState } from "react";
import Display from "./shared/Display";
import ButtonBar from "./shared/ButtonBar";

function CategoriesTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const headers = ['category', 'raceNo', 'handicap'];

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
            edit={props.edit}
            delete={props.delete}
          />
        )}
      </div>

      <ButtonBar
        tab={props.tab}
        add={props.add}
      />
    </div>
  );
}

export default CategoriesTab;
