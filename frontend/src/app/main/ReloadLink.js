"use client";

export default function ReloadLink({ href, children, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = href; /** FULL PAGE RELOAD */
  };

  return (
    <a href={href} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
