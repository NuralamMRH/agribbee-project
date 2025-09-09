import * as React from "react";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

export default function TextareaDecorators(props) {
  const {
    label,
    required,
    touched,
    errors,
    value,
    fieldProps,
    onChangeHandler,
    rows,
    disabled,
    height,
    backgroundColor,
  } = props;

  const [inputValue, setInputValue] = React.useState(value);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChangeHandler) onChangeHandler(newValue);
  };

  const handleBlur = () => {
    if (onChangeHandler) onChangeHandler(inputValue);
  };

  return (
    <Textarea
      {...fieldProps}
      placeholder="Type in here…"
      label={label}
      required={required}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      minRows={rows || 2}
      maxRows={rows ? rows * 2 : 4}
      disabled={disabled}
      error={Boolean(touched && errors)}
      helperText={touched && errors ? errors : ""}
      endDecorator={
        <Typography level="body-xs" sx={{ ml: "auto" }}>
          {inputValue.length} character(s)
        </Typography>
      }
      sx={{
        minWidth: 300,
        height: height || "auto",
        backgroundColor: backgroundColor || "white",
        borderColor: touched && errors ? "red" : "inherit",
        borderWidth: touched && errors ? "2px" : "1px",
      }}
    />
  );
}
