import { titleize, pluralize } from "../../../../utils/helpers";

function ImportExportField({ field, title, obj, formData, setFormData }) {
  const currentValue = formData[field] ?? null;

  return (
    <>
    {title}:
      {obj['import'][field].map((objField) => {
        return (
          <div key={`${objField}`}>
            <input
              id={`${field}-${objField}`}
              type='radio'
              name={field}
              className={`${field}-input`}
              value={objField}
              onChange={event =>
                setFormData({ ...formData, [field]: event.target.value })
              }
              checked={currentValue === objField}
            />
            <label htmlFor={`${field}-${objField}`}>
              {
                field === 'items'
                ? titleize(pluralize(objField))
                : titleize(objField)
              }
            </label><br></br>
          </div>
        )
      })}
    </>
  );
};

export default ImportExportField;
