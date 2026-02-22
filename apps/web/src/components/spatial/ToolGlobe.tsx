"use client";
import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

function ToolNode({ tool, position, onClick }: { tool: any, position: [number, number, number], onClick: (t: any) => void }) {
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.lookAt(0, 0, 0);
        }
    });

    return (
        <group position={position} ref={ref}>
            <mesh
                onClick={(e) => { e.stopPropagation(); onClick(tool); }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[2, 16, 16]} />
                <meshStandardMaterial color={hovered ? "#ec4899" : "#3b82f6"} emissive={hovered ? "#ec4899" : "#000"} />
            </mesh>
            <Html distanceFactor={40}>
                <div style={{
                    background: hovered ? "rgba(236, 72, 153, 0.9)" : "rgba(15, 23, 42, 0.8)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(255,255,255,0.2)",
                    pointerEvents: "none",
                    transform: "translate3d(-50%, -150%, 0)"
                }}>
                    {tool.name}
                </div>
            </Html>
        </group>
    );
}

function Connections({ tools }: { tools: any[] }) {
    return (
        <mesh>
            <icosahedronGeometry args={[48, 2]} />
            <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.3} />
        </mesh>
    );
}

function Scene({ tools, onSelectTool }: { tools: any[], onSelectTool: (t: any) => void }) {
    const nodes = useMemo(() => {
        const radius = 50;
        return tools.slice(0, 100).map((tool, i) => {
            const phi = Math.acos(-1 + (2 * i) / Math.min(tools.length, 100));
            const theta = Math.sqrt(Math.min(tools.length, 100) * Math.PI) * phi;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            return { tool, position: [x, y, z] as [number, number, number] };
        });
    }, [tools]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Connections tools={tools} />
            {nodes.map((node, i) => (
                <ToolNode key={node.tool.id} tool={node.tool} position={node.position} onClick={onSelectTool} />
            ))}
            <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} minDistance={60} maxDistance={200} />
        </>
    );
}

export default function ToolGlobe({ tools }: { tools: any[] }) {
    const handleSelectTool = (tool: any) => {
        console.log("Selected:", tool.name);
    };

    return (
        <div style={{ width: "100%", height: "100vh", background: "#000" }}>
            <Canvas camera={{ position: [0, 0, 120], fov: 60 }}>
                <Scene tools={tools} onSelectTool={handleSelectTool} />
            </Canvas>
        </div>
    );
}
