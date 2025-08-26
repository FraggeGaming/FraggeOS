import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import type { AppWindowProps } from "./appProps";

export default function Game({ }: AppWindowProps) {
  const base = import.meta.env.BASE_URL;
  const { unityProvider } = useUnityContext({
    loaderUrl: `${base}Build/unityWeb.loader.js`,
    dataUrl: `${base}Build/unityWeb.data.br`,
    frameworkUrl: `${base}Build/unityWeb.framework.js.br`,
    codeUrl: `${base}Build/unityWeb.wasm.br`,
  });

  return (
    <div className="flex-1 min-h-0">
      <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden bg-black">
        <Unity
          unityProvider={unityProvider}
          className="block h-full w-full"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </div>
  );
}
