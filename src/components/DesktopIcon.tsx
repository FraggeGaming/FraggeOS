import { Node } from "./FileManager";

interface DesktopIconProps {
  node: Node;
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function AppIcon({ node, onDoubleClick }: DesktopIconProps) {

  const folderIcon = "/icons/folder.png";
  const fileIcon = "/icons/file.png";

  const imgSrc = node.appdata?.icon ?? (node.isFile ? fileIcon : folderIcon)
  return (
    <div>
      <button
        onDoubleClick={onDoubleClick}
        className="flex flex-col items-center justify-center gap-2 rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        title={node.label}
      >
        <img
          src={imgSrc}
          alt=""
          className="h-16 w-16 select-none"
          draggable={false}
        />
        <span className="truncate text-sm text-white text-center w-full">
          {node.appdata ? node.appdata.title : node.label}
        </span>
      </button>
    </div>
  );
}

export function AppIconSmall({ node, onDoubleClick }: DesktopIconProps) {

  const folderIcon = "/icons/folder.png";
  const fileIcon = "/icons/file.png";

  const imgSrc = node.appdata?.icon ?? (node.isFile ? fileIcon : folderIcon)
  return (
    <div>
      <button
        onDoubleClick={onDoubleClick}
        className="group flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
        title={node.label}
      >
        <img
          src={imgSrc}
          alt=""
          className="h-4 w-4 select-none"
          draggable={false}
        />
        <span className="truncate">{node.appdata ? node.appdata.title : node.label}</span>
      </button>
    </div>
  );
}