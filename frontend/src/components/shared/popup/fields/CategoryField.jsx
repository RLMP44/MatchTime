function CategoryField({ field, title, categories, formData, setFormData }) {
  // updates racer info upon selecting category from dropdown
  function updateCategoryInfo({ field, categories, event }) {
    const selectedCategory = categories.find(cat => cat.category === event.target.value);
      setFormData({
      ...formData,
      [field]: event.target.value,
      'sex': selectedCategory.sex,
      'handicap': selectedCategory.handicap,
      'raceNo': selectedCategory.raceNo
    });
  };

  // creates dropdown for category field when adding a new racer
  return (
    <>
      {title}:
        <select name={field}
          className={`${field}-select`}
          value={formData[field] ?? ''}
          onChange={event => updateCategoryInfo({ field, categories, event })}
          >
        <option value="" disabled>Select</option>
        {categories.map((cat) => {
          return (
            <option key={cat.category} value={cat.category}>{cat.category}</option>
          )})
        };
      </select>
    </>
  );
};

export default CategoryField;
