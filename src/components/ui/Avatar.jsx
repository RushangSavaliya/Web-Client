const Avatar = ({ username, size = "md", className = "" }) => {
    const sizeClass = size === "sm" ? "avatar sm" : "avatar";

    return (
        <div className={`${sizeClass} ${className}`}>
            {username?.charAt(0)?.toUpperCase() || "?"}
        </div>
    );
};

export default Avatar;
