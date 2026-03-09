import { useState } from "react";
import { titleize, pluralize } from "../../utils/helpers";
import { useTranslation } from "react-i18next";

function Popup(props) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ ...props.data });
  const sexes = ['F', 'M'];

  function setTitle(crud, target) {
    return (crud === 'import' || crud === 'export') ? `${titleize(crud)} ${pluralize(titleize(target))}` : `${titleize(crud)} ${titleize(target)}`;
  };

  // adjusts formData to contain proper types
  function formatRecord(data) {
    var formattedData = { ...data }
    if (data.age) { formattedData.age = parseInt(data.age) }
    if (data.bib) { formattedData.bib = parseInt(data.bib) }
    if (data.raceNo) { formattedData.raceNo = parseInt(data.raceNo) }
    return formattedData;
  };

  // swaps recorded time and place to updated racer when bib is changed in timer display
  async function switchRacers(data) {
    const user = await props.fetchRecord(data.bib);
    if (user) {
      return {
        ...data,
        ...user,
        place: props.data.place,
        time: props.data.time
      };
    } else {
      return {
        place: props.data.place,
        bib: data.bib,
        age: null,
        sex: null,
        raceNo: null,
        handicap: null,
        timeRaw: null,
        city: null,
        time: props.data.time,
        fName: null,
        lName: "Not Found",
        division: null
      }
    }
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

    props.edit({oldRecord: props.data, newRecord: updatedRecord});
  };


  // ----------------- EVENT HANDLING LOGIC -----------------
  async function handleSubmit(event) {
    const button = event.target.id;
    let formattedForm = formatRecord(formData);

    if (button === "update-button" && props.tab === "timer") {
      updateTimerDisplayRecord(formattedForm);
    } else if (button === 'update-button') {
      props.edit({ newData: formattedForm, oldData: props.data });
    } else if (button === 'add-button') {
      props.add(formattedForm);
      setFormData({});
    } else if (button === "delete-button") {
      props.delete(props.data);
    };
    props.setIsDisplayed(false);
  };

  function handleGeneralFields({ field, title }) {
    return (
      <>
        {title}:
        <input
          className={`${field}-input`}
          value={formData[field] ?? ""}
          onChange={event =>
            setFormData({ ...formData, [field]: event.target.value })
          }
        />
      </>
    );
  };

  function updateDivisionInfo({ field, categories, event }) {
    const selectedCategory = categories.find(cat => cat.category === event.target.value)
      setFormData({
      ...formData,
      [field]: event.target.value,
      'sex': selectedCategory.sex,
      'handicap': selectedCategory.handicap,
      'raceNo': selectedCategory.raceNo
    })
  }

  function handleDivisionField({ field, title, categories = [] }) {
    return (
      <>
        {title}:
          <select name={field}
            className={`${field}-select`}
            onChange={event => updateDivisionInfo({ field, categories, event })}
            >
          {categories.map((division) => {
            return (
              <option key={division.category} value={division.category}>{division.category}</option>
            )})
          };
        </select>
      </>
    )
  };

  function handleSexField({ field, title, editable }) {
    const currentValue = formData[field] ?? null;
    return (
      <>
      {title}:
        {sexes.map((sex) => {
          return (
            <div key={`${sex}-${editable}`}>
              <input
                id={`${field}-${sex}`}
                type='radio'
                name={field}
                className={`${field}-input`}
                value={sex}
                onChange={event =>
                  setFormData({ ...formData, [field]: event.target.value })
                }
                disabled={!editable}
                checked={currentValue === sex}
              />
              <label htmlFor={`${field}-${sex}`}>{sex}</label><br></br>
            </div>
          )
        })}
      </>
    );
  }

  // TODO: disallow chars in int fields, etc

  return (
    <div className="dialog">
      <h4 className="title">{setTitle(props.crud || '', props.tab || '')}</h4>
      <div className="border"></div>
      <div className="popup-body">
        <div className={`popup-content ${props.crud}`}>
          {props.popUpFields?.length > 0 && (
            props.popUpFields.map(field => {
              let title = t(`${field}`);
              return (
                <div key={field} className={`${field}`}>
                  {field !== 'division' && field !== 'sex' && handleGeneralFields({ field, title })}
                  {field === 'sex' && handleSexField({ field, title, editable: props.tab === 'category' })}
                  {field === 'division' && handleDivisionField({ field, title, categories: props.categories })}
                </div>
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
