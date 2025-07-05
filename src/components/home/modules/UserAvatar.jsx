// File: src/components/home/modules/UserAvatar.jsx

function UserAvatar({ username, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const appliedSize = sizeClasses[size] || sizeClasses["md"];

  return (
    <div
      className={`rounded-full bg-neutral text-neutral-content flex items-center justify-center font-medium shadow-inner shrink-0 ${appliedSize}`}
    >
      {username?.charAt(0).toUpperCase()}
    </div>
  );
}

export default UserAvatar;
