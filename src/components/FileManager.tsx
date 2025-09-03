import React from "react";
import ResumeApp from "./apps/ResumeApp";
import ProjectsApp from "./apps/ProjectsApp";
import TerminalApp from "./apps/TerminalApp";
import Explorer from "./apps/Explorer";
import type { AppWindowProps } from "./apps/appProps";
import TextFile from "./apps/TextFile";
import content from "../assets/content.json";
import ImageViewer from "./apps/ImageViewer";
import Game from "./apps/Game";

import { levenshteinEditDistance } from 'levenshtein-edit-distance'

const componentRegistry = {
    resume: ResumeApp,
    projects: ProjectsApp,
    terminal: TerminalApp,
    explorer: Explorer,
    textFile: TextFile,
    imageViewer: ImageViewer,
    game: Game
} as const;

type ComponentId = keyof typeof componentRegistry;


export interface AppData {
    title: string;
    icon: string;
    key: ComponentId;

}

export const textFileData = new Map<string, string>();


export class Node {
    public parent: Node | null = null;
    public children: Node[] = [];
    public label = "";
    public id: string = crypto.randomUUID();

    //If this node is a file/app, app is defined:
    public appdata: AppData | null = null;

    constructor(parent: Node | null, label: string, appdata: AppData | null = null) {
        this.parent = parent;
        this.label = label;
        this.appdata = appdata;
        if (parent) parent.children.push(this);
    }

    addChild(child: Node) {
        this.children.push(child);
    }

    isRoot(): boolean {
        return this.parent === null;
    }

    get isFile(): boolean {
        return this.appdata !== null;
    }

    getComponent(): React.ComponentType<AppWindowProps> | null {
        if (!this.appdata) return null;
        return componentRegistry[this.appdata.key];
    }
}


function buildFilesystem(): Node {
    const r = new Node(null, "C");

    const desktop = new Node(r, "Desktop");

    new Node(desktop, "Photos", {
        title: "Photos",
        icon: "/icons/gallery.png",
        key: "imageViewer",
    })

    new Node(desktop, "Resume", {
        title: "Resume.pdf",
        icon: "/icons/document.png",
        key: "resume",
    });

    new Node(desktop, "Terminal", {
        title: "Terminal",
        icon: "/icons/terminal.png",
        key: "terminal",
    });

    new Node(desktop, "Explorer", {
        title: "Explorer",
        icon: "/icons/computer.png",
        key: "explorer",
    });

    const rs = new Node(desktop, "RandomStuff");
    const tirl = new Node(rs, "FraggPad+-", {
        "title": "This Is Rocket Leauge!",
        "icon": "/icons/document.png",
        "key": "textFile",
    });


    textFileData.set(tirl.id, content?.["FraggPad+-"]?.bread);


    const projects = new Node(r, "Projects");
    new Node(projects, "Antzation", {
        title: "Antzation",
        icon: "/icons/document.png",
        key: "game",
    });

    new Node(r, "AppData");
    return r;
}
export function SearchFs(text: string, root: Node): Node[] {
    const results: { node: Node; dist: number }[] = [];
    const queue = [root];

    while (queue.length > 0) {
        const node = queue.shift();
        if (!node) continue;


        const dist = levenshteinEditDistance(text, node.label);
        results.push({ node, dist });

        for (const child of node.children) {
            queue.push(child);
        }
    }

    //sort by distance

    console.table(results.slice(0, 10).sort((a, b) => a.dist - b.dist).map(r => ({ label: r.node.label, dist: r.dist })));

    return results
        .filter(r => r.node.appdata)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 10)
        .map(r => r.node);
}


export const findNode = (root: Node, label: string): Node | null => {
    if (root.label === label) return root;
    if (!root.children) return null;

    for (const child of root.children) {
        const found = findNode(child, label);
        if (found) return found;
    }
    return null;
};

export const findNodes = (root: Node, labels: string[]): Node[] => {
    return labels
        .map(p => findNode(root, p))            // Node | undefined
        .filter((n): n is Node => n != null);   // remove undefined/null
};

export const fetchFounderNode = (n: Node): Node => {
        let adam = n;
        while (adam.parent) {
            adam = adam.parent;
        }
        return adam;
    }



export const getPath = (n: Node): Node[] => {

    const labels: Node[] = [];
    let current: Node | null = n;
    //console.log("Starting search for path")
    while (current) {
        labels.push(current)
        current = current.parent;
        //console.log("path: " + current?.label)

    }
    labels.reverse();

    return labels;
}


export function useFilesystem() {
    const rootRef = React.useRef<Node>(buildFilesystem());
    const [, setTick] = React.useState(0);
    const bump = () => setTick(t => t + 1);

    const addFolder = (parentNode: Node, label: string) => {
        if (parentNode.appdata !== null) return;
        new Node(parentNode, label);

        bump();
    }

    const addFile = (parentNode: Node, label: string) => {
        if (parentNode.appdata !== null) return;
        new Node(parentNode, label);

        bump();
    }

    //Add more file system changes here

    return { root: rootRef.current, addFolder, addFile };
}
