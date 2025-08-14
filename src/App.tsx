import { useState } from 'react'

import "./index.css";

import Window from "./components/Window";
import Explorer from './components/apps/Explorer';
import TerminalApp from './components/apps/TerminalApp';
import { ClickableIcon } from './components/DesktopIcon';

import { Node, useFilesystem } from "./components/FileManager"


type WindowEntry = {
  id: string;
  node: Node;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
};


export default function App(): React.JSX.Element {
  const folderIcon: string = "/icons/folder.png";

  const fs = useFilesystem(); // once!
  const { root, addFolder, addFile } = fs;
  const [windows, setWindows] = useState<WindowEntry[]>([]);

  const openApp = (n: Node, title: string) => {
    setWindows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        node: n,
        title: title,
        x: 100,
        y: 100,
        width: 600,
        height: 400,
        minimized: false,
        maximized: false,
      },
    ]);
  };


  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, minimized: !win.minimized, maximized: false } : win
      )
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(win =>
        win.id === id
          ? { ...win, maximized: !win.maximized, minimized: false }
          : win
      )
    );
  };

  const findDesktopNode = (root: Node): Node | undefined => {
    if (root.label === "Desktop") return root;
    if (!root.children) return undefined;

    for (const child of root.children) {
      const found = findDesktopNode(child);
      if (found) return found;
    }
    return undefined;
  };


  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">

      </header>

      <div
        className="desktop fixed inset-x-0 top-0 bottom-14 w-full bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url('/desktopIcon.jpg')" }}
      >

        {findDesktopNode(root)?.children.map((app) => {
          const icon = app.appdata ? app.appdata.icon : folderIcon;
          return (
            <ClickableIcon
              title={app.label}
              icon={icon}
              onDoubleClick={() => openApp(app, app.label)}
            />
          );
        })}


        {/* Windows */}
        {windows.map((win) => {
          const AppComponent = win.node.appdata ? win.node.appdata.Component : Explorer;
          const extraProps = { openApp, root , addFolder, addFile};

          return (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              minimized={win.minimized}
              maximized={win.maximized}
              x={win.x}
              y={win.y}
              width={win.width}
              height={win.height}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => maximizeWindow(win.id)}
              onClose={() => closeWindow(win.id)}
              onMoveResize={(x: number, y: number, width: number, height: number) => {
                setWindows((prev) =>
                  prev.map((w) =>
                    w.id === win.id ? { ...w, x, y, width, height } : w
                  )
                );
              }}
            >
              <AppComponent {...extraProps} />
            </Window>
          );
        })}
      </div>

      {/* Taskbar */}
      <div className="fixed inset-x-0 bottom-0 h-14 z-[1000] border-t border-white/10 bg-zinc-900/70 backdrop-blur-md shadow-[0_-6px_18px_rgba(0,0,0,0.35)]">
        <div className="mx-auto h-full px-3">
          <div className="flex h-full items-center">
            {/* left spacer (where Start/search would go) */}
            <div className="flex-1" />

            {/* centered icons */}
            <div className="flex items-center gap-2">
              {windows.map((win) => {
                const iconSrc = win.node.appdata?.icon;
                const isMin = !!win.minimized;
                const isActive = !win.minimized && win.maximized;

                return (
                  <button
                    key={win.id}
                    title={win.title}
                    onClick={() =>
                      minimizeWindow(win.id)
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      closeWindow(win.id);
                    }}
                    className={[
                      "relative h-10 w-10 rounded-xl",
                      "flex items-center justify-center",
                      "transition-transform duration-150",
                      "hover:bg-white/10 active:scale-95",
                      isMin ? "opacity-70" : "opacity-100",
                    ].join(" ")}
                  >
                    {iconSrc && (
                      <img
                        src={iconSrc}
                        alt=""
                        className="block h-6 w-6 select-none"
                        draggable={false}
                      />
                    )}

                    {/* win11 style indicator */}
                    <span
                      className={[
                        "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full",
                        "transition-all duration-200",
                        isActive
                          ? "w-4 h-1.5 bg-white/90"
                          : isMin
                            ? "w-2 h-1 bg-white/40"
                            : "w-3 h-1 bg-white/70",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>

            {/* right side (system tray/clock placeholder) */}
            <div className="flex-1 flex items-center justify-end pr-2">
              <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-200/80">
                <span className="px-2 py-1 rounded-md bg-white/5">EN</span>
                <span className="px-2 py-1 rounded-md bg-white/5">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
