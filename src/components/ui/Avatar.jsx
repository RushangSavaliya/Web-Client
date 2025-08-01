const Avatar = ({ 
  username, 
  size = "md", 
  className = "",
  online = false,
  showIndicator = false 
}) => {
  const sizeClasses = {
    sm: "avatar sm",
    md: "avatar",
    lg: "avatar lg",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {username?.charAt(0)?.toUpperCase() || "?"}
      {showIndicator && (
        <div className={`status-indicator ${online ? "" : "offline"}`} />
      )}
    </div>
  );
};

export default Avatar;
