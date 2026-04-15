import { range } from '../../../../utils/helpers';

function race_noField({ field, title, formData, setFormData }) {
  let race_noLimit = 8;
  let raceSelections = range(1, race_noLimit);

  return (
    <>
      {title}:
        <select name={field}
          className={`${field}-select`}
          value={formData[field] ?? ''}
          onChange={event => setFormData({ ...formData, [field]: event.target.value })}
          >
        <option value="" disabled>Select</option>
        {raceSelections.map((num) => {
          return (
            <option key={num} value={num}>{num}</option>
          )})
        };
      </select>
    </>
  );
};

export default race_noField;
