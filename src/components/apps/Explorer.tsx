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


    const findNode = (root: Node, label: string): Node | undefined => {
        if (root.label === label) return root;
        if (!root.children) return undefined;

        for (const child of root.children) {
            const found = findNode(child, label);
            if (found) return found;
        }
        return undefined;
    };

    const fetchPinnedNodes = (): Node[] => {
        const pinned = ["Desktop", "Terminal", "Explorer"];
        return pinned
            .map(p => findNode(root, p))            // Node | undefined
            .filter((n): n is Node => n != null);   // remove undefined/null
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        console.log("right click is triggered");

    }



    const getPath = (n: Node) => {

        const labels: Node[] = [];
        let current: Node | null = n;

        while (current) {
            labels.push(current)
            current = current.parent;
        }
        labels.reverse();

        return (
            <div className="flex flex-row space-x-1">
                {labels.map((node, idx) => (
                    <div key={idx} className="flex flex-row items-center space-x-2">
                        <button onClick={() => setOpenNode(node)}>
                            {node.label}
                        </button>
                        {idx < labels.length - 1 && <span className="mx-2">&gt;</span>}
                    </div>
                ))}

            </div>
        )
    }




    return (
        <div className="grid grid-rows-[auto_1fr] grid-cols-[16rem_1fr] gap-2 h-full min-h-0 text-sm text-zinc-100" >            {/* Toolbar */}
            <div className="col-span-2 h-12 bg-gray-800 flex items-center gap-4 p-2">

                <div className="w-26 flex gap-5">
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

                <div className="flex flex-1/2 bg-gray-700 p-1 rounded pl-2 pr-2">
                    {getPath(openNode ?? adam)}
                </div>

                <div className="bg-gray-700 flex flex-1 items-center justify-center rounded p-1">
                    <p className="flex items-center">Search</p>
                </div>


            </div>

            {/* Children */}

            <div className="flex flex-row gap-2 col-span-2">
                <div className="bg-gray-800 rounded h-full min-h-0 overflow-auto p-1 flex-1">
                    <ul className="space-y-1">
                        {fetchPinnedNodes().map((child) => (
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


                </div>

                <div
                    className="min-h-0 overflow-auto bg-gray-800 flex-1/2"
                    onContextMenu={handleRightClick}
                >
                    {current.children?.length ? (
                        <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-2">
                            {current.children.map((child) => (
                                <li key={child.id}>
                                    <button
                                        onDoubleClick={() => handleOpen(child)}
                                        className="flex flex-col items-center justify-center gap-2 rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        title={child.label}
                                    >
                                        <img
                                            src={child.appdata?.icon ?? (child.isFile ? fileIcon : folderIcon)}
                                            alt=""
                                            className="h-16 w-16 select-none"
                                            draggable={false}
                                        />
                                        <span className="truncate text-sm text-white text-center w-full">
                                            {child.appdata ? child.appdata.title : child.label}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <em className="text-zinc-400">No children</em>
                    )}
                </div>

            </div>
        </div>
    );
}
