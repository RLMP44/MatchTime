import RacerDisplay from "./RacerDisplay";

function RacersTab(props) {

  return (
    <div className="racers-tab">
      <div className="records-display-container">
        <RacerDisplay />
        {props.records.map(racer =>
          <RacerDisplay
            key={racer.id}
            data={racer}
            addRacer={props.addRacer}
            editRacer={props.editRacer}
            deleteRacer={props.deleteRacer}
          />)}
      </div>
    </div>
  );
}

export default RacersTab;
