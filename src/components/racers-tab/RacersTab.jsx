import { useState } from "react";
import Display from "../shared/Display";
import ButtonBar from "../shared/ButtonBar";

function RacersTab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const headers = ['bib', 'fName', 'lName', 'division'];

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
            setDisplayRecords={props.setDisplayRecords}
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

export default RacersTab;
