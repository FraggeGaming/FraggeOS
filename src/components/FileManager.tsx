import React from "react";
import ResumeApp from "./apps/ResumeApp";
import ProjectsApp from "./apps/ProjectsApp";
import TerminalApp from "./apps/TerminalApp";
import Explorer from "./apps/Explorer";
import type { AppWindowProps } from "./apps/appProps";
import TextFile from "./apps/TextFile";
import content from "../assets/content.json";
import ImageViewer from "./apps/ImageViewer";

const componentRegistry = {
    resume: ResumeApp,
    projects: ProjectsApp,
    terminal: TerminalApp,
    explorer: Explorer,
    textFile: TextFile,
    imageViewer: ImageViewer
} as const;

type ComponentId = keyof typeof componentRegistry;


export interface AppData {
    title: string;
    icon: string;
    bread: string | null;
    key: ComponentId;

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
        bread: null
    })

    new Node(desktop, "Resume", {
        title: "Resume.pdf",
        icon: "/icons/document.png",
        key: "resume",
        bread: null
    });

    new Node(desktop, "Terminal", {
        title: "Terminal",
        icon: "/icons/terminal.png",
        key: "terminal",
        bread: null
    });

    new Node(desktop, "Explorer", {
        title: "Explorer",
        icon: "/icons/computer.png",
        key: "explorer",
        bread: null
    });

    const rs = new Node(desktop, "RandomStuff");
    const fp = "FraggPad+-"
    new Node(rs, fp, {
        ...content[fp],
        key: content[fp].key as ComponentId,
    });

    const projects = new Node(r, "Projects");
    new Node(projects, "Antzation", {
        title: "Antzation",
        icon: "/icons/document.png",
        key: "projects",
        bread: null
    });

    new Node(r, "AppData");
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
