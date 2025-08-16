import React from "react";
import Window from "./Window";
import Explorer from "./apps/Explorer";
import type { WindowEntry } from "../App";
import type { AppWindowProps } from "./apps/appProps";


type WindowManagerProps = {
    windows: WindowEntry[];
    setWindows: React.Dispatch<React.SetStateAction<WindowEntry[]>>;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    closeWindow: (id: string) => void;
    appProps: AppWindowProps;
};

export default function WindowManager({
    windows,
    setWindows,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    appProps,
}: WindowManagerProps) {
    return (
        <>
            {windows.map((win) => {
                const AppComponent = win.node.getComponent() ?? Explorer;

                //If it's a folder (Explorer), override root.
                const propsForThisWindow =
                    win.node.appdata === null && AppComponent === Explorer
                        ? { ...appProps, root: win.node } // per-window override
                        : appProps;

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
                                prev.map((w) => (w.id === win.id ? { ...w, x, y, width, height } : w)),
                            );
                        }}
                    >
                        <AppComponent {...propsForThisWindow} />
                    </Window>
                );
            })}
        </>
    );
}