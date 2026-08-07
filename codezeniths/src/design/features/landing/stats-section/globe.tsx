'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '@codezeniths/modules';
import * as THREE from 'three';

// Suppress THREE.Clock deprecation warning caused by @react-three/fiber
if (typeof console !== 'undefined') {
    const originalWarn = console.warn;
    console.warn = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
        originalWarn(...args);
    };
}

const ParticleGlobe = ({ isDark }: { isDark: boolean }) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate points on a sphere using Fibonacci lattice for even distribution
    const [positions, colors] = useMemo(() => {
        const count = 4000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        // Use a softer, lighter primary for dark mode, and a deep darker primary for light mode
        const baseColor = new THREE.Color(isDark ? '#6a7cff' : '#2a3bbf');
        // Add variation using white for dark mode (makes it glow), and dark blue/black for light mode
        const mixColor = new THREE.Color(isDark ? '#ffffff' : '#101850');
        
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            // Adjusted globe size to be a bit larger again
            const r = 2.75;

            positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Just add a tiny bit of variation for depth, keeping it single-toned
            const mixedColor = baseColor.clone().lerp(mixColor, Math.random() * 0.4);

            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }
        
        return [positions, colors];
    }, [isDark]);

    useFrame((state) => {
        if (pointsRef.current) {
            // Mouse parallax effect
            const targetX = state.pointer.y * 0.15;
            const targetY = state.pointer.x * 0.15 + (state.clock.elapsedTime * 0.05);
            
            pointsRef.current.rotation.x += (targetX - pointsRef.current.rotation.x) * 0.05;
            pointsRef.current.rotation.y += (targetY - pointsRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group>
            {/* The core particle sphere */}
            <points ref={pointsRef} key={isDark ? 'dark' : 'light'}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                        args={[colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.02}
                    vertexColors={true}
                    transparent={true}
                    opacity={0.9}
                    sizeAttenuation={true}
                    blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
                />
            </points>
        </group>
    );
};


export const GlobeCanvas = () => {
    const { isDark } = useTheme();

    return (
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <ParticleGlobe isDark={isDark} />
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    autoRotate 
                    autoRotateSpeed={0.8} 
                    maxPolarAngle={Math.PI / 1.5} 
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
};
