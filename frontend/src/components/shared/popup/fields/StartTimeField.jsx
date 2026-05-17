function StartTimeField({ field, title, divisions, formData, setFormData }) {
  // creates time selection field when editing or adding a division
  return (
    <>
      {title}:
        <input
          name={field}
          type="time"
          className={`${field}-select`}
          value={formData[field] ?? ''}
          onChange={event => setFormData({ ...formData, [field]: event.target.value })}
        >
      </input>
    </>
  );
};

export default StartTimeField;
