import { useState } from "react";
import RacerDisplay from "./RacerDisplay";
import ButtonBar from "../shared/ButtonBar";

function RacersTab(props) {
  const racerAttributes = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];
  const basicButtonTypes = ['cancel', 'save', 'done'];

  const [buttonTypes, setButtonTypes] = useState(basicButtonTypes);

  return (
    <div className="racers-tab">
      <div className="records-display-container">
        <RacerDisplay />
        {props.records.map(racer =>
          <RacerDisplay
            key={racer.id}
            data={racer}
            tab={"racer"}
            crud={props.crud}
            setCrud={props.setCrud}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            editRacer={props.editRacer}
            deleteRacer={props.deleteRacer}
          />)}
      </div>
      <ButtonBar
        tab={"racer"}
        crud={props.crud}
        setCrud={props.setCrud}
        addRacer={props.addRacer}
        setButtonTypes={setButtonTypes}
        buttons={buttonTypes}
        fields={racerAttributes}
      />
    </div>
  );
}

export default RacersTab;
