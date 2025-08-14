import { Node } from "../FileManager";

export type OpenApp = (node: Node, title: string) => void;

export interface AppWindowProps {
    root: Node;
    openApp: OpenApp;
    addFolder: (parent: Node, label: string) => void;
    addFile: (parent: Node, label: string) => void;
}