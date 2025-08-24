import React from "react";
import type { AppWindowProps } from "./appProps";
import { textFileData } from "../FileManager";
export default function TextFile({ root }: AppWindowProps) {
    const title = root.appdata?.title ?? "Untitled.txt";
    const content =
        textFileData.get(root.id) ??
        "This document is empty. Type something inspiring…";

    return (
        <div className="h-full w-full flex flex-col bg-zinc-900 border border-zinc-700 overflow-hidden text-zinc-100">
            {/* App header */}
            <div className="px-3 py-1.5 text-xs border-b border-zinc-700 bg-zinc-800/80">
                {title}
            </div>


            {/* Editor */}
            <div className="flex-1 min-h-0">
                <textarea
                    className="h-full w-full resize-none outline-none border-0 p-3 font-mono text-[13px] leading-6 tracking-tight
                     bg-zinc-900 text-zinc-100 selection:bg-blue-600 selection:text-white"
                    defaultValue={content}
                    spellCheck={false}
                    wrap="soft"
                />
            </div>

            {/* Status bar */}
            <div className="h-6 px-3 text-[12px] border-t rounded-br-md rounded-bl-md border-zinc-700 bg-zinc-800/80 text-zinc-400 flex items-center justify-between">
                <span>UTF-8  |  FraggOS (CRLF)</span>
            </div>
        </div>
    );
}
