import { useState } from "react";
import type { AppWindowProps } from "./appProps";
import { Node, findNodes, getPath, fetchFounderNode } from "../FileManager";
import { AppIcon, AppIconSmall } from "../DesktopIcon";
import { SearchBar } from "../SearchBar";
import { DisplayNodeIcons } from "../NodeIconDisplay";


export default function Explorer({ openApp, root }: AppWindowProps) {
    const [openNode, setOpenNode] = useState<Node | null>(null);
    const [searchResult, setSearchResult] = useState<Node[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    const handleOpen = (n: Node) => {
        if (n.appdata) {
            openApp(n);
        } else {
            setOpenNode(n);
        }
    };

    const adam = fetchFounderNode(root);

    const current = openNode ?? root;


    const fetchPinnedNodes = (): Node[] => {
        const pinned = ["Desktop", "Terminal", "Explorer"];
        return findNodes(adam, pinned);
    };

    const handleRightClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("right click is triggered");

    }

    const visibleNodes =
        searchValue.trim() !== "" && searchResult.length > 0
            ? searchResult
            : current.children;

    return (
        <div className="grid grid-rows-[auto_1fr] grid-cols-[16rem_1fr] gap-2 h-full min-h-0 text-sm text-zinc-100" >
            
            <Toolbar
                openNode={current}
                setOpenNode={setOpenNode}
                adam={adam}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setSearchResult={setSearchResult}
            />

            <div className="flex flex-row gap-2 col-span-2">
                {/* pinned nodes, left box */}
                <div className="bg-gray-800 rounded h-full min-h-0 overflow-auto p-1 flex-1">
                    <DisplayNodeIcons
                        nodes={fetchPinnedNodes()}
                        onClick={handleOpen}
                        Item={AppIconSmall}
                        layout="list"
                    />
                </div>

                {/* Center box, displays the open nodes, or visible files and maps */}
                <div className="min-h-0 overflow-auto bg-gray-800 flex-1/2" onContextMenu={handleRightClick}>
                    <DisplayNodeIcons
                        nodes={visibleNodes}
                        onClick={handleOpen}
                        Item={AppIcon}
                        layout="grid"
                    />
                </div>
            </div>
        </div >
    );
}

interface ToolbarProps {
    openNode: Node;
    setOpenNode: React.Dispatch<React.SetStateAction<Node | null>>;
    adam: Node;
    
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    setSearchResult: React.Dispatch<React.SetStateAction<Node[]>>;

}

export function Toolbar({ openNode, setOpenNode, adam, searchValue, setSearchValue, setSearchResult }: ToolbarProps) {
    const backIcon = "/icons/back.png";
    const homeIcon = "/icons/home.png";
    const labels: Node[] = getPath(openNode);
    return (
        <div className="col-span-2 h-12 bg-gray-800 flex items-center gap-4 p-2">

            <div className="w-26 flex gap-5">
                <button
                    onClick={() => setOpenNode(openNode.parent ?? adam)}
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
            </div>

            <SearchBar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setSearchResult={setSearchResult}
                node={adam}
            />


        </div>
    );

}