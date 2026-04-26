import { useState, useMemo } from "react";
import { titleize, pluralize, convertToMs, diff } from "../../../utils/helpers";
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

  // converts numeric fields in formData
  function formatRecord(data) {
    var formattedData = {}
    for (const key in data) {
      let value = data[key];
      if (["age", "bib", "race_no", "division_id", "category_id"].includes(key)) {
        value = parseInt(value);
      };

      formattedData[key] = value;
    }
    return formattedData;
  };


  // ----------------- EVENT HANDLING LOGIC -----------------
  async function handleSubmit(event) {
    const button = event.target.id;
    let formattedForm = formatRecord(formData);
    if (button === "update-button" && props.tab === "timer") {
      props.update({ prevData: props.data, newData: formattedForm });
    } else if (button === 'update-button') {
      const changed = diff(props.data, formattedForm)
      props.edit({ oldRecord: props.data, newRecord: changed });
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
