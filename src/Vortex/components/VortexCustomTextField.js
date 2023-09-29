import React, { useEffect } from "react"
import { TextField } from "@mui/material"
import { useField } from "formik"
import MoneyInput from "@rschpdr/react-money-input";

const VortexCustomTextField = ({
  type,
  label,
  placeholder,
  inputProps,
  helperText,
  ...props
}) => {
  const [field, meta, helpers] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const [value, setValue] = React.useState(meta?.initialValue);


  function handleChange(e) {


    if (e.target.value.match(/[&\/\\#,+()$~%-.'":*?<>{}]/g)) {
      return
    }
    setValue(e.target.value)

  }

  useEffect(() => {
    helpers.setValue(value);
  }, [value])


  if (inputProps.datatype === "money") {
    return (
      <>
        <TextField
          // currencyConfig={
          // {
          //   locale: "tl-PH",
          //   currencyCode: "PHP",
          //   currencyDisplay: "symbol",
          //   minimumFractionDigits:2,
          //   useGrouping: true
          // }}
          // customInput={TextField}
          value={value}
          label={label}
          variant="outlined"
          required
          fullWidth
          error={!!errorText}
          type={'number'}
          min={inputProps.minLength}
          max={inputProps.maxLength}
          inputProps={inputProps}
          helperText={`Minimum value: ${inputProps.minLength} - Format: ${helperText} - Reminder: the value here is in Peso(Php) ₱`}
          placeholder={placeholder}
          // onChange={(e) => {
          //   handleChange(e)
          // }}
          {...field}
        // value={value}
        />
      </>
    )
  } else {

    return (
      <TextField
        value={value}
        label={label}
        variant="outlined"
        required
        fullWidth
        type={type}
        placeholder={placeholder}
        helperText={helperText !== label ? helperText : ""}
        error={!!errorText}
        inputProps={inputProps}
        onChange={(e) => {
          handleChange(e)
        }}
      />
    )
  }

}

export default VortexCustomTextField
