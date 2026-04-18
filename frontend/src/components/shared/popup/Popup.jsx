import { useState, useMemo } from "react";
import { titleize, pluralize, convertToMs } from "../../../utils/helpers";
import { useTranslation } from "react-i18next";
import createFieldRenderers from "./fieldRenderers";
import GeneralField from "./fields/GeneralField";

function Popup(props) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ ...props.data });
  const fieldRenderers = useMemo(
    () => createFieldRenderers({ props, formData, setFormData }),
    [props, formData]
  );

  function setTitle(crud, target) {
    return (crud === 'import' || crud === 'export') ?
      `${titleize(crud)} ${pluralize(titleize(target))}` :
      `${titleize(crud)} ${titleize(target)}`;
  };

  // adjusts formData to contain proper types
  function formatRecord(data) {
    var formattedData = { ...data }
    if (data.age) { formattedData.age = parseInt(data.age) }
    if (data.bib) { formattedData.bib = parseInt(data.bib) }
    if (data.race_no) { formattedData.race_no = parseInt(data.race_no) }
    if (data.division_id) { formattedData.division_id = parseInt(data.division_id) }
    if (data.category_id) { formattedData.category_id = parseInt(data.category_id) }
    return formattedData;
  };

  // swaps recorded time and place to updated racer when bib is changed in timer display
  async function switchRacers(data) {
    const user = await props.fetchRecord(data.bib);
    const timeInMs = typeof(props.data.time_raw) === 'string'
      ? convertToMs(props.data.time_raw)
      : props.data.time_raw
    if (user) {
      return {
        ...data,
        ...user,
        place: props.data.place,
        time_raw: timeInMs
      };
    } else {
      return {
        place: props.data.place,
        bib: data.bib,
        age: null,
        sex: null,
        race_no: null,
        handicap: null,
        time_raw: timeInMs,
        city: null,
        time: null,
        first_name: null,
        last_name: "Not Found",
        category: null,
        division: null
      }
    }
  };

  // updates single record in timer display (time or racer)
  // converts updated time into milliseconds
  async function updateTimerDisplayRecord(data) {
    const bibChanged = data.bib && data.bib !== props.data.bib;
    const timeInMs = typeof(data.time_raw) === "string"
      ? convertToMs(data.time_raw)
      : data.time_raw;
    const timeChanged = timeInMs && timeInMs !== props.data.time_raw;
    let updatedRecord = { ...props.data };

    if (bibChanged) {
      const newUser = await switchRacers(data);
      updatedRecord = { ...updatedRecord, ...newUser };
    };
    if (timeChanged) {
      updatedRecord.time_raw = timeInMs;
    };
    props.update({ oldRecord: props.data, newRecord: updatedRecord })
  };


  // ----------------- EVENT HANDLING LOGIC -----------------
  async function handleSubmit(event) {
    const button = event.target.id;
    let formattedForm = formatRecord(formData);
    if (button === "update-button" && props.tab === "timer") {
      updateTimerDisplayRecord(formattedForm);
    } else if (button === 'update-button') {
      props.edit({ oldRecord: props.data, newRecord: formattedForm });
    } else if (button === 'add-button') {
      props.add(formattedForm);
      setFormData({});
    } else if (button === "delete-button") {
      props.delete(props.data);
    };
    props.setIsDisplayed(false);
  };


  // ----------------- RENDERING LOGIC -----------------
  function renderField( field, title ) {
    const renderer = fieldRenderers[field];
    return renderer
      ? renderer({ field, title })
      : <GeneralField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
        timerTab={props.tab === 'timer'}
      />
  };

  // TODO: disallow chars in int fields, etc

  return (
    <div className="dialog">
      <h4 className="title">{setTitle(props.crud || '', props.tab || '')}</h4>
      <div className="border"></div>

      <div className="popup-body">
        <div className={`popup-content ${props.crud}-${props.tab}`}>
          {props.popUpFields?.length > 0 && (
            props.popUpFields.map(field => {
              let title = t(`${field}`);
              return (
                <label key={field} className={field} data-testid={`popup-${field}`}>
                  {renderField(field, title)}
                </label>
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
