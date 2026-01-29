import { useState } from "react";

function Popup(props) {
  // TODO: make Popup component completely reusable and DRY
  const [time, setTime] = useState(props?.data?.time || "");
  const [bibNum, setBibNum] = useState(props?.data?.bib || "");

  function titleize(string) {
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

  // ----------------- RECORD EDIT LOGIC START -----------------
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
      props.deleteRecord(props.data);
    } else {
      console.log('cancelled');
    }
    props.setIsDisplayed("none");
  }
  // ----------------- RECORD EDIT LOGIC END -----------------

  return (
    <div className="dialog">
      <h4 className="title">{props.type}</h4>
      <div className="border"></div>
      <div className="popup-content">
        {props.fields.map(field => {
          let title = field === "fName" ? "First Name" : field === "lName" ? "Last Name" : titleize(field);
          return (
            <p key={field}>{title}: <input className={`${field}-input`} onChange={event => setTime(event.target.value)}></input></p>
          );
        })}
        <div className="popup-buttons-container">
          {props.buttons.map(button =>
            <button key={button} className="btn" id={`${button}-button`} onClick={handleSubmit}>{titleize(button)}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Popup;
