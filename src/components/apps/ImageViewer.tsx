import React, { useMemo, useState } from "react";
import type { AppWindowProps } from "./appProps";

export default function ImageViewer({ root }: AppWindowProps) {
    const [activeImage, setActiveImage] = useState<number | null>(null);

    const images = import.meta.glob("../../assets/photos/*.png", {
        eager: true,
        import: "default",
    }) as Record<string, string>;

    //sorted list of srcs
    const imageSrcs = useMemo(
        () =>
            Object.entries(images)
                .sort(([a], [b]) => a.localeCompare(b)) // sort by path
                .map(([, v]) => v),
        []
    );

    const activeSrc =
        activeImage !== null ? imageSrcs.at(activeImage) ?? null : null;

    return (
        <div className="h-full w-full min-h-0 flex flex-col">
            {activeImage !== null && activeSrc && (
                <div className="h-full w-full overflow-hidden">
                    <div className="flex h-full w-full flex-col min-h-0">

                        <div
                            className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-hidden"
                            onClick={() => setActiveImage(null)}
                        >
                            <img
                                src={activeSrc}
                                alt={`image-${activeImage}`}
                                loading="lazy"
                                className="w-auto h-auto max-w-full max-h-full object-contain"
                            />
                        </div>

                        <div className="h-16 shrink-0 flex justify-center items-center gap-4 border-t border-zinc-700">
                            <button
                                onClick={() =>
                                    setActiveImage((prev) => {
                                        const total = imageSrcs.length;
                                        if (prev === null) return total - 1;
                                        return (prev - 1 + total) % total;
                                    })
                                }
                                type="button"
                                className="flex justify-center items-center me-4 h-full cursor-pointer group focus:outline-none"
                            >
                                <span className="text-gray-400 hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
                                    <svg className="rtl:rotate-180 w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                                    </svg>
                                    <span className="sr-only">Previous</span>
                                </span>
                            </button>

                            <button
                                onClick={() =>
                                    setActiveImage((prev) => {
                                        const total = imageSrcs.length;
                                        if (prev === null) return 0;
                                        return (prev + 1) % total;
                                    })
                                }
                                type="button"
                                className="flex justify-center items-center h-full cursor-pointer group focus:outline-none"
                            >
                                <span className="text-gray-400 hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
                                    <svg className="rtl:rotate-180 w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                    <span className="sr-only">Next</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeImage === null && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageSrcs.map((src, i) => (
                        <div
                            key={i}
                            className="relative aspect-square overflow-hidden rounded-xl"
                            onClick={() => setActiveImage(prev => (prev === i ? null : i))}
                        >
                            <img
                                src={src}
                                alt={`image-${i}`}
                                loading="lazy"
                                className="h-auto max-w-full rounded-lg object-cover transition-transform duration-200 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}
