import React from "react";

function Avatar({ user, sizeClass = "w-8 h-8", textClass = "text-sm", dark = false }) {
  if (!user) return null;

  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        className={`${sizeClass} rounded-full object-cover shadow-sm ${
          dark ? "border border-white/15" : "border border-white"
        }`}
        alt={`${user.name}'s avatar`}
      />
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div
      className={`${sizeClass} flex items-center justify-center font-semibold rounded-full shadow-sm ${textClass} ${
        dark ? "bg-luminous-moss text-silver" : "bg-fresh-canopy text-white"
      }`}
    >
      {initial}
    </div>
  );
}

export default Avatar;
