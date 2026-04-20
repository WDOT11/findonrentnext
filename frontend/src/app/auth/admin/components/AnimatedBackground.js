'use client';
import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    class Line {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.life = Math.random() * 300 + 200;
        this.color = `hsla(${Math.random() * 360}, 80%, 60%, 0.6)`;
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.x += this.vx + (mouse.current.x - canvas.width / 2) * 0.00001;
        this.y += this.vy + (mouse.current.y - canvas.height / 2) * 0.00001;
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        this.life--;
        if (
          this.life <= 0 ||
          this.x < 0 ||
          this.y < 0 ||
          this.x > canvas.width ||
          this.y > canvas.height
        ) {
          this.reset();
        }
      }
    }

    const lines = Array.from({ length: 120 }, () => new Line());

    const animate = () => {
      ctx.fillStyle = "rgba(0, 25, 50, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => line.draw());
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
