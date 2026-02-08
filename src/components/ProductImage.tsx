"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl border border-gray-100 cursor-crosshair bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain transition-transform duration-200 ease-out ${
          isHovering ? "scale-150" : "scale-100"
        }`}
        style={{
          transformOrigin: isHovering ? `${mousePos.x}% ${mousePos.y}%` : "center center",
        }}
        priority
      />
      
      {/* Optional: Hint for user */}
      {!isHovering && (
        <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-xs text-gray-600 backdrop-blur-sm pointer-events-none">
          Survolez pour zoomer
        </div>
      )}
    </div>
  );
}
