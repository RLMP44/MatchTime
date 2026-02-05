import { useState } from "react";

function Popup(props) {
  // TODO: make Popup component completely reusable and DRY
  const [formData, setFormData] = useState({});

  function titleize(string) {
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

  // ----------------- RACER HANDLING LOGIC -----------------
  async function handleSubmit(event) {
    const button = event.target.id;
    console.log(button)
    console.log(props.tab)

    if (button === 'save-button' && props.crud === "Add" && props.tab === "racer") {
      console.log("adding racer");
      props.addRacer(formData);
      setFormData({});
    }
    else if (button === 'save-button' && props.crud === "Edit" && props.tab === "racer") {
      // use object spreading to update only updated fields in racer record
      var updatedRacer = {
        ...props.data,
        ...formData,
      };
      props.editRacer({ newData: updatedRacer, oldData: props.data });
    } else if (button === 'cancel-button') {
      console.log('cancelled');
    } else if (button === "update-button" && props.tab === "timer") {
      const bibChanged = formData.bib && formData.bib !== props.data.bib;
      const timeChanged = formData.time && formData.time !== props.data.time;

      let updatedRecord = { ...props.data };
      if (bibChanged) {
        const user = await props.fetchRecord(parseInt(formData.bib));
        updatedRecord = {
          ...updatedRecord,
          ...user,
          place: props.data.place,
          time: updatedRecord.time
        };
      }

      if (timeChanged) { updatedRecord.time = formData.time };

      props.editRecords({oldRecord: props.data, newRecord: updatedRecord});
    } else if (button === "delete-button") {
      props.deleteRecord(props.data)
    } else {
      console.log('cancelled')
    }
    props.setIsDisplayed(false);
  }

  return (
    <div className="dialog">
      <h4 className="title">{titleize(props.crud)} {titleize(props.tab)}</h4>
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
