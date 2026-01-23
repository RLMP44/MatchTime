import { useState } from "react";

function RecordDisplay(params) {
  let [isDisplayed, setIsDisplayed] = useState("none");

  function handlePopUp() {
    setIsDisplayed(isDisplayed === "none" ? "" : "none");
  }

  function handleSubmit() {

  }

  return (
    <div>
      <div className="record-container" onClick={handlePopUp}>
        <p>{ params.data ? params.data.place : <strong>Place</strong>}</p>
        <p>{ params.data ? params.data.bib : <strong>Bib #</strong>}</p>
        <p>{ params.data ? params.data.time : <strong>Time</strong>}</p>
        <p>{ params.data ? params.data.name : <strong>Name</strong>}</p>
      </div>

      {/* ------------- POPUP ------------- */}
      <div className="dialog" style={{display: isDisplayed}}>
        <h4 className="title">Edit Record</h4>
        <div className="border"></div>
        <div className="popup-content">
          <p>Bib#: {params?.data?.bib}</p>
          <p>Name: {params?.data?.name}</p>
          <p>Place: <input className='place-input' value={params?.data?.place}></input></p>
          <p>Time: <input className='time-input' value={params?.data?.time}></input></p>
          <div className="popup-buttons-container">
            <button className="btn cancel-button" onClick={handleSubmit}>Cancel</button>
            <button className="btn save-button" onClick={handleSubmit}>Save</button>
            <button className="btn delete-button" onClick={handleSubmit}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordDisplay;
