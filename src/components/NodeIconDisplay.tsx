import type { DesktopIconProps } from "./DesktopIcon";
import type { Node } from "./FileManager";

interface DisplayNodeIconsProps {
    nodes: Node[] | undefined;
    onClick: (n: Node) => void;
    Item: React.ComponentType<DesktopIconProps>;
    layout?: "grid" | "list";
}

export function DisplayNodeIcons({nodes, onClick, Item, layout}:DisplayNodeIconsProps){

    const css = layout === 'grid'
     ? "grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-2"
     : "space-y-1"

    return (
        <ul className={css}>
            {nodes?.map((child) => (
                <li key={child.id}>
                    <Item
                        node={child}
                        onDoubleClick={() => onClick(child)}
                    />
                </li>
            ))}

        </ul>
    );


}