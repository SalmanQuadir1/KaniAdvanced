import ReactDatePicker from "react-datepicker";
import { useField, useFormikContext } from "formik";

export const DatePickerField = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  return (
    <ReactDatePicker
      {...field}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(date) => setFieldValue(name, date)}
      dateFormat="yyyy-MM-dd" // Format for the date
      placeholderText="Select Order Date"
      className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
    />
  );
};