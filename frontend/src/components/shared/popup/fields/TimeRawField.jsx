import { timeForDisplay } from '../../../../utils/helpers';

function time_rawField({ field, title, formData, setFormData }) {
  // if time is already 'HH:MM:SS:MS' format, leave as-is
  // if raw number, convert to display format
  let value = typeof(formData['time_raw']) === 'string'
    ? formData['time_raw']
    : timeForDisplay(formData['time_raw']);

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

export default time_rawField;
