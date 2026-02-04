import { useState } from "react";
import RacerDisplay from "./RacerDisplay";
import ButtonBar from "../shared/ButtonBar";

function RacersTab(props) {
  const basicButtonTypes = ['cancel', 'save', 'done'];
  const [crud, setCrud] = useState('');
  const [popUpFields, setPopUpFields] = useState([]);
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
            crud={crud}
            setCrud={setCrud}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            popUpFields={popUpFields}
            setPopUpFields={setPopUpFields}
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
