import { timeForDisplay } from "../../../../utils/helpers";

// standard input forms for general fields
function GeneralField({ field, title, formData, setFormData, timerTab }) {
  const value = timerTab && field === 'timeRaw'
    ? timeForDisplay(formData['timeRaw'])
    : formData[field];

  return (
    <>
      {title}:
      <input
        className={`${field}-input`}
        value={value ?? ''}
        onChange={event =>
          setFormData({ ...formData, [field]: event.target.value })
        }
      />
    </>
  );
};

export default GeneralField;
