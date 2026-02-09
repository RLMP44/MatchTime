import { useState } from "react";
import { titleize, pluralize } from "../../utils/helpers";

function Popup(props) {
  const [formData, setFormData] = useState({});

  function setTitle(crud, target) {
    return (crud === 'import' || crud === 'export') ? `${titleize(crud)} ${pluralize(titleize(target))}` : `${titleize(crud)} ${titleize(target)}`;
  };

  // adjusts formData to contain proper types
  function formatRecord(data) {
    return {
      ...data,
      bib: parseInt(data.bib),
      age: parseInt(data.age),
      raceNo: parseInt(data.raceNo)
    };
  };

  // swaps recorded time and place to updated racer when bib is changed in timer display
  async function switchRacers(data) {
    const user = await props.fetchRecord(data.bib);
    return {
      ...data,
      ...user,
      place: props.data.place,
      time: props.data.time
    };
  };

  // updates single record in timer display (time or racer)
  async function updateTimerDisplayRecord(data) {
    const bibChanged = data.bib && data.bib !== props.data.bib;
    const timeChanged = data.time && data.time !== props.data.time;
    let updatedRecord = { ...props.data };

    if (bibChanged) {
      const newUser = await switchRacers(data);
      updatedRecord = { ...updatedRecord, ...newUser };
    };
    if (timeChanged) { updatedRecord.time = data.time };

    props.editRecords({oldRecord: props.data, newRecord: updatedRecord});
  };


  // ----------------- EVENT HANDLING LOGIC -----------------
  async function handleSubmit(event) {
    const button = event.target.id;
    let formattedForm = formatRecord(formData);

    if (button === 'add-button' && props.crud === "add" && props.tab === "racer") {
      props.addRacer(formattedForm);
      setFormData({});
    } else if (button === 'update-button' && props.crud === "edit" && props.tab === "racer") {
      props.editRacer({ newData: formattedForm, oldData: props.data });
    } else if (button === "update-button" && props.tab === "timer") {
      updateTimerDisplayRecord(formattedForm);
    } else if (button === "delete-button") {
      props.deleteRecord(props.data)
    } else {
      console.log('something went wrong')
    };
    props.setIsDisplayed(false);
  };

  return (
    <div className="dialog">
      <h4 className="title">{setTitle(props.crud || '', props.tab || '')}</h4>
      <div className="border"></div>
      <div className="popup-body">
        <div className={`popup-content ${props.crud}`}>
          {props.popUpFields?.length > 0 && (
            props.popUpFields.map(field => {
              let title = field === "fName" ? "First Name" : field === "lName" ? "Last Name" : titleize(field);
              return (
                <p key={field} className={`${field}`}>
                  {title}: <input
                    className={`${field}-input`}
                    value={formData[field] ?? props.data?.[field] ?? ""}
                    onChange={event =>
                      setFormData({...formData, [field]: event.target.value})
                    }>
                  </input>
                </p>
              );
            })
          )}
        </div>
        {props.buttons?.length > 0 && (
          <div className="popup-buttons-container">
            {props.buttons.map(button =>
              <button
                key={button}
                className="btn"
                id={`${button}-button`}
                onClick={handleSubmit}
              >
                {titleize(button)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Popup;
