import { range } from '../../../../utils/helpers';

function RaceNoField({ field, title, formData, setFormData }) {
  let raceNoLimit = 8;
  let raceSelections = range(1, raceNoLimit);

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

export default RaceNoField;
