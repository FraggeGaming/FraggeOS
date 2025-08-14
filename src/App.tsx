import { useState } from 'react'

import "./index.css";

import WindowManager from './components/WindowManager';
import Taskbar from "./components/Taskbar";

import { ClickableIcon } from './components/DesktopIcon';

import { Node, useFilesystem } from "./components/FileManager"


export type WindowEntry = {
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

  const appProps = { openApp, root, addFolder, addFile, };


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

        <WindowManager
          windows={windows}
          setWindows={setWindows}
          minimizeWindow={minimizeWindow}
          maximizeWindow={maximizeWindow}
          closeWindow={closeWindow}
          appProps={appProps}
        />
      </div>

      <Taskbar
        windows={windows}
        minimizeWindow={minimizeWindow}
        closeWindow={closeWindow}
      />

    </div>
  );
}
