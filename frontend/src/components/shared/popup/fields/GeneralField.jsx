// standard input forms for general fields
function GeneralField({ field, title, formData, setFormData }) {
  return (
    <>
      {title}:
      <input
        className={`${field}-input`}
        value={formData[field] ?? ''}
        onChange={event =>
          setFormData({ ...formData, [field]: event.target.value })
        }
      />
    </>
  );
};

export default GeneralField;
