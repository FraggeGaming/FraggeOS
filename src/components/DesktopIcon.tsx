interface ClickableIconProps {
  title: string;
  icon: string | null;
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ClickableIcon({ title, icon, onDoubleClick }: ClickableIconProps) {

  return (
    <button
      type="button"
      onDoubleClick={onDoubleClick}
      style={{
        background: "none",
        border: "none",
        padding: 8,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
      title={title}
    >
      {icon && (
        <img
          src={icon}
          alt=""
          width={32}
          height={32}
          style={{ display: "block" }}
        />
      )}
      <span>{title}</span>
    </button>
  );
}