function DivisionField({ field, title, divisions, formData, setFormData }) {
  console.log('here')
  // updates racer info upon selecting division from dropdown
  function updateDivisionInfo({ field, divisions, event }) {
    const selectedDivision = divisions.find(div => div.division === event.target.value);
      setFormData({
      ...formData,
      [field]: event.target.value,
      'race_no': selectedDivision.race_no
    });
  };

  // creates dropdown for division field when adding a new racer
  return (
    <>
      {title}:
        <select name={field}
          className={`${field}-select`}
          value={formData[field] ?? ''}
          onChange={event => updateDivisionInfo({ field, divisions, event })}
          >
        <option value="" disabled>Select</option>
        {divisions.map((div) => {
          return (
            <option key={div.division} value={div.division}>{div.division}</option>
          )})
        };
      </select>
    </>
  );
};

export default DivisionField;
