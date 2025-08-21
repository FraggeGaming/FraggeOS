import React from "react";
import type { AppWindowProps } from "./appProps";
import { useState } from "react";

export default function ImageViewer({ root }: AppWindowProps) {

    const [activeImage, setActiveImage] = useState<string | null>(null);

    const images = import.meta.glob("../../assets/photos/*.png", {
        eager: true,
        import: "default",
    }) as Record<string, string>;

    const getActiveImage = () => {
        if (!activeImage) return null;

        return (
            <div
                className="flex items-center justify-center bg-black/80"
                onClick={() => setActiveImage(null)}
            >
                <img
                    src={activeImage}
                    alt={`image-${activeImage}`}
                    loading="lazy"
                    className="max-w-full object-contain"
                />
            </div>
        );
    };

    const printThemAll = () => {
        if (activeImage) return;
        return (
            <div className="
        grid gap-3
        [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]
        sm:[grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]
        md:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]
      ">
                {Object.values(images).map((src, i) => (
                    <div
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-xl"
                        onClick={() =>
                            setActiveImage((prev) => (prev === src ? null : src)) // toggle
                        }
                    >
                        <img
                            src={src}
                            alt={`image-${i}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                        />

                    </div>
                ))}
            </div>
        );
    }

    return (

        <div className="flex flex-1 items-center justify-center">
            {getActiveImage()}
            {printThemAll()}
        </div>
    );
}
