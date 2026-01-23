import { useState } from "react";

function RecordDisplay(props) {
  let [isDisplayed, setIsDisplayed] = useState("none");
  const [time, setTime] = useState(props?.data?.time || "");
  const [bibNum, setBibNum] = useState(props?.data?.bib || "");
  function handlePopUp() {
    setIsDisplayed(isDisplayed === "none" ? "" : "none");
  }

  async function handleSubmit(event) {
    const button = event.target.id;
    if (button === "update-button") {
      const user = (bibNum !== props.data.bib) ? await props.fetchRecord(parseInt(bibNum)): props.data;
      const newTime = (time !== props.data.time) ? time : props.data.time;
      // {...data} clones the data
      var updatedRecord = {
        ...props.data,
        id: user.id,
        bib: user.bib,
        time: newTime,
        name: user.name
      };

      props.editRecords({oldRecord: props.data, newRecord: updatedRecord});
    } else if (button === "delete-button") {
      props.deleteRecord(props.data)
    } else {
      console.log('cancelled')
    }
    setIsDisplayed("none")
  }

  return (
    <div>
      <div className="record-container" onClick={handlePopUp}>
        <p>{ props.data ? props.data.place : <strong>Place</strong>}</p>
        <p>{ props.data ? props.data.bib : <strong>Bib #</strong>}</p>
        <p>{ props.data ? props.data.time : <strong>Time</strong>}</p>
        <p>{ props.data ? props.data.name : <strong>Name</strong>}</p>
      </div>

      {/* ------------- POPUP ------------- */}
      <div className="dialog" style={{display: isDisplayed}}>
        <h4 className="title">Edit Record</h4>
        <div className="border"></div>
        <div className="popup-content">
          <p>Time: <input className='time-input' value={time} onChange={event => setTime(event.target.value)}></input></p>
          <p>Bib#: <input className='bib-input' value={bibNum} onChange={event => setBibNum(event.target.value)}></input></p>
          <div className="popup-buttons-container">
            <button className="btn" id="cancel-button" onClick={handleSubmit}>Cancel</button>
            <button className="btn" id="update-button" onClick={handleSubmit}>Update</button>
            <button className="btn" id="delete-button" onClick={handleSubmit}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordDisplay;
