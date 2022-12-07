import { useState, useCallback } from "react";

export function useForm(initialValues = {}, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const handleUserInput = (event) => {
    if (Array.isArray(event)) {
      setValues({
        ...values,
        ...Object.fromEntries(
          event.map(({ target }) => [target.name, target.value])
        ),
      });
      setTouched({
        ...touched,
        ...Object.fromEntries(event.map(({ target }) => [target.name, true])),
      });
    } else {
      const { name, value } = event.target;
      setValues({ ...values, [name]: value });
      if (!touched[name]) {
        setTouched({ ...touched, [name]: true });
      }
    }
  };

  const handleSubmit = (e) => {
    onSubmit(values);
    setTouched({});
    e.preventDefault();
    //scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const reset = useCallback((values) => {
    setValues(values);
    setTouched({});
  }, []);

  return { values, touched, handleUserInput, handleSubmit, reset };
}
