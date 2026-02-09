import { useState } from "react";
import RacerDisplay from "./RacerDisplay";
import ButtonBar from "../shared/ButtonBar";

function RacersTab(props) {
  const racerAttributes = ['bib', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'raceNo', 'division'];

  const [crud, setCrud] = useState('');
  const [popUpFields, setPopUpFields] = useState(racerAttributes);
  const [buttonTypes, setButtonTypes] = useState([]);

  return (
    <div className="racers-tab">
      <div className="records-display-container">
        <RacerDisplay />
        {props.records.map(racer =>
          <RacerDisplay
            key={racer.id}
            data={racer}
            tab={"racer"}
            crud={crud}
            setCrud={setCrud}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            popUpFields={popUpFields}
            setPopUpFields={setPopUpFields}
            setDisplayRecords={props.setDisplayRecords}
            editRacer={props.editRacer}
            deleteRacer={props.deleteRacer}
          />)}
      </div>
      <ButtonBar
        tab={"racer"}
        crud={crud}
        setCrud={setCrud}
        addRacer={props.addRacer}
        setButtonTypes={setButtonTypes}
        buttons={buttonTypes}
        popUpFields={popUpFields}
        setPopUpFields={setPopUpFields}
      />
    </div>
  );
}

export default RacersTab;
