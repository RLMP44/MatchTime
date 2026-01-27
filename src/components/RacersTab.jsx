import { useState } from "react";

function RacersTab(props) {

  return (
    <div className="records-display-container">
      <div className="record-container racer-tab-record">
        <p><strong>Bib #</strong></p>
        <p><strong>Name</strong></p>
        <p><strong>Division</strong></p>
      </div>
      {props.records.map(racer =>
        <div className="record-container racer-tab-record">
          <p>{ racer?.bib }</p>
          <p>{ racer?.name }</p>
          <p>{ racer?.division }</p>
        </div>
      )}
    </div>
  );
}

export default RacersTab;
