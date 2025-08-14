import React from "react";
import ResumeApp from "./apps/ResumeApp";
import ProjectsApp from "./apps/ProjectsApp";
import TerminalApp from "./apps/TerminalApp";
import Explorer from "./apps/Explorer";


export interface AppData {
    title: string;
    icon: string;
    Component: React.ComponentType<any>;
}


export class Node {
    public parent: Node | null = null;
    public children: Node[] = [];
    public label = "";
    public id: string = crypto.randomUUID();

    // If this node is a file/app, app is defined:
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
}

function buildFilesystem(): Node {
    const r = new Node(null, "C");

    const desktop = new Node(r, "Desktop");

    new Node(desktop, "Resume", {
        title: "Resume",
        icon: "/icons/document.png",
        Component: ResumeApp,
    });

    new Node(desktop, "Terminal", {
        title: "Terminal",
        icon: "/icons/terminal.png",
        Component: TerminalApp,
    });

    new Node(desktop, "Explorer", {
        title: "Explorer",
        icon: "/icons/computer.png",
        Component: Explorer,
    });

    new Node(desktop, "RandomStuff");

    const projects = new Node(r, "Projects");
    new Node(projects, "Antzation", {
        title: "Antzation",
        icon: "/icons/document.png",
        Component: ProjectsApp,
    });

    const appData = new Node(r, "AppData");
    return r;
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
