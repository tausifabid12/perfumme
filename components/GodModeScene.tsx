"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GodModeScene() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current!;

        // -----------------------------
        // SCENE
        // -----------------------------
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            1,
            3000
        );

        camera.position.z = 600;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // -----------------------------
        // PARTICLES (HIGH DENSITY FIELD)
        // -----------------------------
        const count = 2;
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

            speeds[i] = Math.random() * 0.5 + 0.2;
        }

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            size: 2.2,
            color: new THREE.Color("#ffffff"),
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // -----------------------------
        // LIGHT FOG LAYER (GOD MODE EFFECT)
        // -----------------------------
        const fogGeometry = new THREE.SphereGeometry(800, 32, 32);
        const fogMaterial = new THREE.MeshBasicMaterial({
            color: "#000000",
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide,
        });

        const fog = new THREE.Mesh(fogGeometry, fogMaterial);
        scene.add(fog);

        // -----------------------------
        // SCROLL STATE
        // -----------------------------
        let targetY = 0;
        let smoothY = 0;

        // -----------------------------
        // SCROLL LISTENER (GLOBAL ENGINE HOOK)
        // -----------------------------
        const onScroll = () => {
            const max =
                document.documentElement.scrollHeight - window.innerHeight;

            const p = window.scrollY / max;

            targetY = p * Math.PI * 2; // full rotation loop

            document.documentElement.style.setProperty(
                "--scroll-p",
                String(p)
            );
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        // -----------------------------
        // ANIMATION LOOP (GOD MODE CORE)
        // -----------------------------
        const animate = () => {
            requestAnimationFrame(animate);

            const velocity =
                parseFloat(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--scroll-velocity") || "0"
                ) || 0;

            const speed = Math.min(Math.abs(velocity) * 0.0005, 0.03);

            // smooth camera motion (critical for cinematic feel)
            smoothY += (targetY - smoothY) * 0.08;

            camera.position.y = Math.sin(smoothY) * 120;
            camera.position.x = Math.cos(smoothY) * 120;

            camera.lookAt(0, 0, 0);

            // -----------------------------
            // PARTICLE FIELD MOTION
            // -----------------------------
            points.rotation.y += 0.0005 + speed;
            points.rotation.x += 0.0002;

            // dynamic glow feel
            material.opacity = 0.35 + speed * 6;

            fogMaterial.opacity = 0.15 + speed * 2;

            renderer.render(scene, camera);
        };

        animate();

        // -----------------------------
        // RESIZE
        // -----------------------------
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 z-0" />;
}