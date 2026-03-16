import CategoryField from "./fields/CategoryField";
import GeneralField from "./fields/GeneralField";
import RaceNoField from "./fields/RaceNoField";
import SexField from "./fields/SexField";
import TimeRawField from './fields/TimeRawField';

// use lookup object to simplify rendering and limit branching
function createFieldRenderers({ props, formData, setFormData }) {
  const fieldRenderers = {
    category: ({ field, title }) =>
      props.tab !== 'category'
        ? (
          <CategoryField
            field={field}
            title={title}
            categories={props.categories}
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          <GeneralField
            field={field}
            title={title}
            formData={formData}
            setFormData={setFormData}
          />
        ),

    raceNo: ({ field, title }) =>
      <RaceNoField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
      />,

    sex: ({ field, title }) =>
      <SexField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
        editable={props.tab === 'category'}
      />,

    timeRaw: ({ field, title }) =>
      <TimeRawField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
      />
  };

  return fieldRenderers;
};

export default createFieldRenderers;
