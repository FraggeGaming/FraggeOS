import { Node } from "../FileManager"
import React from "react";
import { useState } from 'react'
import type { AppWindowProps } from "./appProps";

type Line = { text: string };

export default function TerminalApp({ openApp, root, addFolder, addFile }: AppWindowProps) {

  const [openNode, setOpenNode] = useState<Node | null>(null);
  const current = openNode ?? root;

  const [lines, setLines] = React.useState<Line[]>([{ text: "Type `help` to get started." },]);
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);

  const endRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // auto-focus + auto-scroll
  React.useEffect(() => inputRef.current?.focus(), []);
  React.useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [lines]);

  const print = (text: string) => setLines(prev => [...prev, { text }]);
  const clear = () => setLines([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();

    let path = fetchPath(current);

    print(`${path}: ${raw}`)
    setHistory(prev => [...prev, raw]);
    setInput("");

    parseInput(current, raw);
  };

  const parseInput = (currentNode: Node, text: string) => {

    const [cmd, ...args] = text.trim().split(/\s+/);

    switch (cmd) {
      case "help":
        print("Available commands: help, ls, cd, clear, mkdir, exec");
        break;

      case "ls":
        if (currentNode.children.length === 0) {
          print("<empty>");
        } else {
          print(currentNode.children.map((c) => c.label).join("  "));
        }
        break;

      case "cd": {
        if (args.length === 0) {
          print("Usage: cd <folder>");
          break;
        }

        const target = args[0];
        if (target === "..") {
          setOpenNode(currentNode.parent ?? null);
        } else {
          const found = currentNode.children.find(
            (c) => !c.isFile && c.label === target
          );
          if (found) {
            setOpenNode(found);
          } else {
            print(`No such directory: ${target}`);
          }
        }
        break;
      }

      case "mkdir": {
        if (args.length === 0) {
          print("Usage: mkdir <folder>");
          break;
        } else {
          addFolder(currentNode, args[0])
        }
        break;
      }

      case "exec": {
        if (args.length === 0) {
          print("Usage: exec <application>");
          break;
        } else {
          print(currentNode.label);

          const target = currentNode.children?.find(c => c.label === args[0]);

          if (target) {
            openApp(target, target.label);
          } else {
            print(`Application "${args[0]}" not found.`);
          }
        }
        break;
      }

      case "clear":
        clear();
        break;
      default:
        print(`Command not found: ${cmd}`);
    }
  }


  const fetchPath = (n: Node): string => {

    const parts: string[] = [];
    let cNode: Node | null = n;

    while (cNode) {
      parts.unshift(cNode.label);
      cNode = cNode.parent ?? null;
    }
    return parts.join("/");
  }

  return (

    <div className="h-full w-full bg-black text-zinc-100 font-mono text-sm p-3 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Output area */}
        <div className="flex-1 min-h-0 overflow-auto space-y-1">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap leading-6">
              {l.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Prompt */}
        <form onSubmit={handleSubmit} className="pt-2 flex items-center gap-2">
          <span className="text-green-400">{fetchPath(current)}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={() => { }}
            className="flex-1 bg-transparent outline-none caret-green-400"
            aria-label="terminal input"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );

}