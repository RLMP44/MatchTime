function RecordDisplay(params) {

  return (
    <div className="record-container">
      <p>{ params.data ? params.data.place : <strong>Place</strong>}</p>
      <p>{ params.data ? params.data.bib : <strong>Bib #</strong>}</p>
      <p>{ params.data ? params.data.time : <strong>Time</strong>}</p>
      <p>{ params.data ? params.data.name : <strong>Name</strong>}</p>
    </div>
  );
}

export default RecordDisplay;
