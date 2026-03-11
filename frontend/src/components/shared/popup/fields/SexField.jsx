// radio selection for sex, disabled (auto filled) when adding new racer
function SexField({ field, title, editable, formData, setFormData }) {
  const sexes = ['F', 'M'];
  const currentValue = formData[field] ?? null;

  return (
    <>
    {title}:
      {sexes.map((sex) => {
        return (
          <div key={`${sex}-${editable}`}>
            <input
              id={`${field}-${sex}`}
              type='radio'
              name={field}
              className={`${field}-input`}
              value={sex}
              onChange={event =>
                setFormData({ ...formData, [field]: event.target.value })
              }
              disabled={!editable}
              checked={currentValue === sex}
            />
            <label htmlFor={`${field}-${sex}`}>{sex}</label><br></br>
          </div>
        )
      })}
    </>
  );
};

export default SexField;
