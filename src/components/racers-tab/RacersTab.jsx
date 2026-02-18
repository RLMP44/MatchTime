import { useState } from "react";
import Display from "../shared/Display";
import ButtonBar from "../shared/ButtonBar";

function RacersTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const racerFields = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const editButtonTypes = ['cancel', 'update', 'delete'];
  const headers = ['bib', 'name', 'division'];

  const [popUpFields, setPopUpFields] = useState(racerFields);
  const [buttonTypes, setButtonTypes] = useState(editButtonTypes);

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className="racers-tab">
      <div className="records-display-container" onClick={handlePopUp}>
        <Display headers={headers}/>
        {props.records.map(racer =>
          <Display
            key={racer.id}
            headers={headers}
            setIsDisplayed={setIsDisplayed}
            data={racer}
            tab={props.tab}
            crud={'edit'}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            popUpFields={popUpFields}
            setPopUpFields={setPopUpFields}
            setDisplayRecords={props.setDisplayRecords}
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

export default RacersTab;
