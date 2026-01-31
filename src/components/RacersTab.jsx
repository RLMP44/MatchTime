import RacerDisplay from "./RacerDisplay";
import ButtonBar from "./ButtonBar";

function RacersTab(props) {
  const racerAttributes = ['bib#', 'age', 'sex', 'lName', 'fName', 'city', 'handicap', 'race#', 'division'];
  const buttonTypes = ['cancel', 'save', 'done'];


  return (
    <div className="racers-tab">
      <div className="records-display-container">
        <RacerDisplay />
        {props.records.map(racer =>
          <RacerDisplay
            key={racer.id}
            data={racer}
            editRacer={props.editRacer}
            deleteRacer={props.deleteRacer}
          />)}
      </div>
      <ButtonBar
        tab={"racer"}
        addRacer={props.addRacer}
        buttons={buttonTypes}
        fields={racerAttributes}
      />
    </div>
  );
}

export default RacersTab;
