import { Node } from "../FileManager";
import { useState } from 'react'
import type { AppWindowProps } from "./appProps";
        

export default function Explorer({ openApp, root }: AppWindowProps) {

    const [openNode, setOpenNode] = useState<Node | null>(null);

    const current = openNode ?? root;

    const handleOpen = (n: Node) => {
        if (n.appdata !== null) {
            openApp(n, n.appdata!.title);
        } else {
            setOpenNode(n);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button onClick={() => setOpenNode(current.parent ?? null)}>⬅ Back</button>
                <button onClick={() => setOpenNode(null)}>🏠 Root</button>
            </div>

            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                {current.isFile ? "📄" : "📁"} {current.label}
            </div>

            <div style={{ marginLeft: 20 }}>
                {current.children.length ? (
                    current.children.map(child => (
                        <div
                            key={child.id}
                            onDoubleClick={() => handleOpen(child)}
                            style={{ marginBottom: 4, cursor: "pointer" }}
                        >
                            {child.isFile ? "📄" : "📁"} {child.label}
                        </div>
                    ))
                ) : (
                    <em>No children</em>
                )}
            </div>
        </div>
    );

}