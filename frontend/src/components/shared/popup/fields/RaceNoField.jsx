import { range } from '../../../../utils/helpers';

function race_noField({ field, title, formData, editable, setFormData }) {
  let race_noLimit = 8;
  let raceSelections = range(1, race_noLimit);

  return (
    <>
      {title}:
        <select name={field}
          className={`${field}-select`}
          value={formData[field] ?? ''}
          disabled={!editable}
          onChange={event => setFormData({ ...formData, [field]: event.target.value })}
          >
        {raceSelections.map((num) => {
          return (
            <option key={num} value={num} disabled={!editable}>{num}</option>
          )})
        };
      </select>
    </>
  );
};

export default race_noField;
