import type { AppWindowProps } from "./appProps";
import { Unity, useUnityContext } from "react-unity-webgl";


export default function Game({ }: AppWindowProps) {
    const base = import.meta.env.BASE_URL;
const { unityProvider } = useUnityContext({
  loaderUrl:  `${base}Build/WebBuilds.loader.js`,
  dataUrl:    `${base}Build/WebBuilds.data.br`,
  frameworkUrl:`${base}Build/WebBuilds.framework.js.br`,
  codeUrl:    `${base}Build/WebBuilds.wasm.br`,
});
    return <Unity unityProvider={unityProvider} />;
}