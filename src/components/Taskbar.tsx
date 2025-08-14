
import React from "react";
import type { WindowEntry } from "../App";

export interface TaskbarProps {
    windows: WindowEntry[];
    minimizeWindow: (id: string) => void;
    closeWindow: (id: string) => void;
    /** Optional: locale for the clock */
    locale?: string;
}

export default function Taskbar({
    windows,
    minimizeWindow,
    closeWindow,
    locale = "en-US",
}: TaskbarProps): React.JSX.Element {
    const folderIcon: string = "/icons/folder.png";

    return (
        <div className="fixed inset-x-0 bottom-0 h-14 z-[1000] border-t border-white/10 bg-zinc-900/70 backdrop-blur-md shadow-[0_-6px_18px_rgba(0,0,0,0.35)]">
            <div className="mx-auto h-full px-3">
                <div className="flex h-full items-center">
                    {/* left spacer (where Start/search would go) */}
                    <div className="flex-1" />

                    {/* centered icons */}
                    <div className="flex items-center gap-2">
                        {windows.map((win) => {
                            const iconSrc = win.node.appdata ? win.node.appdata.icon : folderIcon;
                            const isMin = !!win.minimized;
                            const isActive = !win.minimized && win.maximized;

                            return (
                                <button
                                    key={win.id}
                                    title={win.title}
                                    onClick={() => minimizeWindow(win.id)}
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
                                {new Date().toLocaleTimeString(locale, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
