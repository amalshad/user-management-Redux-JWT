function Logo({ className = "w-9 h-9", dark = false }) {
  const badgeColor = dark ? "bg-luminous-moss" : "bg-fresh-canopy";
  const glyphColor = dark ? "#141414" : "#E4FD97";

  return (
    <div
      className={`${className} ${badgeColor} rounded-xl flex items-center justify-center shadow-sm shrink-0`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[62%] h-[62%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="9.9" y1="10.1" x2="7.6" y2="7.6" stroke={glyphColor} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="14.1" y1="10.1" x2="16.4" y2="7.6" stroke={glyphColor} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="14.6" x2="12" y2="17" stroke={glyphColor} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.6" fill={glyphColor} />
        <circle cx="6" cy="6" r="2" fill={glyphColor} />
        <circle cx="18" cy="6" r="2" fill={glyphColor} />
        <circle cx="12" cy="19" r="2" fill={glyphColor} />
      </svg>
    </div>
  );
}

export default Logo;
