import type { AppWindowProps } from "./appProps";
import { Unity, useUnityContext } from "react-unity-webgl";


export default function Game({ }: AppWindowProps) {
    const base = import.meta.env.BASE_URL;
const { unityProvider } = useUnityContext({
  loaderUrl:  `${base}Build/unityWeb.loader.js`,
  dataUrl:    `${base}Build/unityWeb.data.br`,
  frameworkUrl:`${base}Build/unityWeb.framework.js.br`,
  codeUrl:    `${base}Build/unityWeb.wasm.br`,
});
    return <Unity unityProvider={unityProvider} />;
}