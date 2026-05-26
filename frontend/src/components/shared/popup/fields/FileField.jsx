function FileField({ field, title, formData, setFormData }) {
  const file = formData[field];

  return (
    <>
    {title}:
      <div key={field}>
        <input
          id={`${field}`}
          type="file"
          accept=".csv"
          name={field}
          className={`${field}-input`}
          onChange={event =>
            setFormData({ ...formData, [field]: event.target.files[0] })
          }
          required
        />
      </div>
    </>
  );
};

export default FileField;
