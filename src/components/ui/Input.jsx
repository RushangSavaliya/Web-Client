import { forwardRef, useState } from "react";

const Input = forwardRef(({ 
  label,
  error,
  type = "text",
  className = "",
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && props.value.toString().length > 0;

  return (
    <div className="form-group">
      <input
        ref={ref}
        type={type}
        className={`input ${error ? "input-error" : ""} ${className}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        {...props}
      />
      {label && (
        <label 
          className={`form-label ${(focused || hasValue) ? "active" : ""}`}
        >
          {label}
        </label>
      )}
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
