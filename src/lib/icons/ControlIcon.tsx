const ControlIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M4 6h11M4 12h7M4 18h11M17 4v4M17 16v4" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
};

export default ControlIcon;
