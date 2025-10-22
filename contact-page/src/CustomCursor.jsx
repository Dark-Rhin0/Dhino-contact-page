import { useEffect } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.id = "glass-cursor";
    document.body.appendChild(cursor);

    let x = 0, y = 0, targetX = -10, targetY = -10;

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const handleMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleClick = () => {
      cursor.classList.add("click");
      setTimeout(() => cursor.classList.remove("click"), 500);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mousedown", handleClick);

    const loop = () => {
      x = lerp(x, targetX, 0.22);
      y = lerp(y, targetY, 0.22);
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mousedown", handleClick);
      cursor.remove();
    };
  }, []);

  return null;
}
