import { Rnd } from "react-rnd";
import type { ReactNode } from "react";

export interface WindowProps {
  id: string;
  title: string;
  children?: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  onMoveResize: (x: number, y: number, width: number, height: number) => void;
  onMinimize: () => void;
  onMaximize: () => void; // toggles maximize
  onClose: () => void;
}

export default function Window({
  title,
  children,
  x,
  y,
  width,
  height,
  minimized,
  maximized,
  onMoveResize,
  onMinimize,
  onMaximize,
  onClose,
}: WindowProps) {
  if (minimized) return null;

  return (
    <Rnd
      bounds=".desktop"
      disableDragging={maximized}
      enableResizing={
        maximized
          ? false
          : {
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }
      }
      size={maximized ? { width: "100%", height: "100%" } : { width, height }}
      position={maximized ? { x: 0, y: 0 } : { x, y }}
      dragHandleClassName="titlebar"
      onDragStop={(_e, d) => onMoveResize(d.x, d.y, width, height)}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onMoveResize(pos.x, pos.y, ref.offsetWidth, ref.offsetHeight)
      }
      style={{ zIndex: 500 }}
    >
      {/* Make the window shell fill the RND container */}
      <div className="h-full flex flex-col rounded-2xl shadow-xl border border-zinc-700 bg-zinc-800 text-zinc-100 overflow-hidden">
        {/* Title bar */}
        <div className="titlebar flex items-center justify-between px-3 py-2 bg-zinc-900/80 border-b border-zinc-700 backdrop-blur select-none cursor-move">
          <span className="font-medium truncate pr-2">{title}</span>

          <div className="flex items-center gap-1">
            <button
              onClick={onMinimize}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-700/60 active:bg-zinc-700 text-zinc-200"
              aria-label="Minimize"
              title="Minimize"
            >
              –
            </button>
            <button
              onClick={onMaximize}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-700/60 active:bg-zinc-700 text-zinc-200"
              aria-label="Maximize"
              title="Maximize"
            >
              {maximized ? "🗗" : "□"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-red-600/70 active:bg-red-600 bg-red-600/40 text-white"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body must expand even when empty */}
        <div className="flex-1 min-h-0 p-4 overflow-auto">
          <div className="flex flex-col h-full">
            {children ?? null}
          </div>

        </div>
      </div>
    </Rnd>
  );
}
