import { timeForDisplay } from '../../../../utils/helpers';

function TimeRawField({ field, title, formData, setFormData }) {
  // if time is already 'HH:MM:SS:MS' format, leave as-is
  // if raw number, convert to display format
  let value = typeof(formData['timeRaw']) === 'string'
    ? formData['timeRaw']
    : timeForDisplay(formData['timeRaw']);

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

export default TimeRawField;
