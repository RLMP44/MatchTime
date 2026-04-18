import CategoryField from "./fields/CategoryField";
import GeneralField from "./fields/GeneralField";
import RaceNoField from "./fields/RaceNoField";
import SexField from "./fields/SexField";
import TimeRawField from './fields/TimeRawField';
import DivisionField from "./fields/DivisionField";

// use lookup object to simplify rendering and limit branching
function createFieldRenderers({ props, formData, setFormData }) {
  const fieldRenderers = {
    category_id: ({ field, title }) =>
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

    race_no: ({ field, title }) =>
      <RaceNoField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
        editable={props.tab === 'division'}
      />,

    sex: ({ field, title }) =>
      <SexField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
        editable={props.tab === 'category'}
      />,

    time_raw: ({ field, title }) =>
      <TimeRawField
        field={field}
        title={title}
        formData={formData}
        setFormData={setFormData}
      />,

    division_id: ({ field, title }) =>
      props.tab !== 'category'
        ? (
          <DivisionField
            field={field}
            title={title}
            divisions={props.divisions}
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
        )
  };

  return fieldRenderers;
};

export default createFieldRenderers;
