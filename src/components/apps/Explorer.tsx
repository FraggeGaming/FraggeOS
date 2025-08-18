import { useState } from "react";
import type { AppWindowProps } from "./appProps";
import type { Node } from "../FileManager";

export default function Explorer({ openApp, root }: AppWindowProps) {
    const [openNode, setOpenNode] = useState<Node | null>(null);
    const folderIcon = "/icons/folder.png";
    const fileIcon = "/icons/file.png";
    const backIcon = "/icons/back.png";
    const homeIcon = "/icons/home.png";

    const handleOpen = (n: Node) => {
        if (n.appdata) {
            openApp(n);
        } else {
            setOpenNode(n);
        }
    };

    const fetchFounder = (n: Node): Node => {
        let adam = n;
        while (adam.parent) {
            adam = adam.parent;
        }
        return adam;
    }

    const current = openNode ?? root;
    const adam = fetchFounder(root);
    console.log(current.label)



    const handleRightClick = (e) => {
        e.preventDefault();
        console.log("right click is triggered");

    }


    return (
        <div className="flex flex-col flex-1 min-h-0 p-3 text-sm text-zinc-100" >            {/* Toolbar */}
            <div className="mb-3 flex items-center gap-2">
                <button
                    onClick={() => setOpenNode(current.parent ?? adam)}
                    className="inline-flex items-center justify-center rounded-md bg-white/5 px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    title="Back"
                >
                    <img
                        src={backIcon}
                        alt="Back"
                        className="h-4 w-4 filter brightness-0 invert"
                        draggable={false}
                    />
                </button>

                <button
                    onClick={() => setOpenNode(adam)}
                    className="inline-flex items-center justify-center rounded-md bg-white/5 px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    title="Home"
                >
                    <img
                        src={homeIcon}
                        alt="Home"
                        className="h-4 w-4 filter brightness-0 invert"
                        draggable={false}
                    />
                </button>
            </div>

            {/* Current path / header */}
            <div className="mb-3 flex items-center gap-2 font-semibold">
                <img
                    src={current.appdata?.icon ?? folderIcon}
                    alt=""
                    className="h-4 w-4 select-none"
                    draggable={false}
                />
                <span className="truncate">{current.label}</span>
            </div>

            {/* Children */}

            <div className="ml-5 flex-1 min-h-0" onContextMenu={handleRightClick}>
                {current.children?.length ? (
                    <ul className="space-y-1">
                        {current.children.map((child) => (
                            <li key={child.id}>
                                <button
                                    onDoubleClick={() => handleOpen(child)}
                                    className="group flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    title={child.label}
                                >
                                    <img
                                        src={child.appdata?.icon ?? (child.isFile ? fileIcon : folderIcon)}
                                        alt=""
                                        className="h-4 w-4 select-none"
                                        draggable={false}
                                    />
                                    <span className="truncate">{child.appdata ? child.appdata.title : child.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <em className="text-zinc-400">No children</em>
                )}
            </div>
        </div>
    );
}
