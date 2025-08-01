import { forwardRef } from "react";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    ghost: "btn-ghost",
  };
  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    circle: "btn-circle",
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="loading-spinner" />
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
