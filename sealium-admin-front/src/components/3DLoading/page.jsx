'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function CurvedSealium() {
  const groupRef = useRef();
  const letters = 'Sealium'.split('');
  const radius = 3; // radius of the curve

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= 0.015; // rotate around Y-axis
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {letters.map((letter, i) => {
        const angle = (i - (letters.length - 1) / 2) * 0.34; // spacing
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const rotationY = angle;

        return (
          <Text
            key={i}
            position={[x, 0, z]}
            rotation={[0, rotationY, 0]}
            fontSize={1.5}
            color="#b1adff"
            anchorX="center"
            anchorY="middle"
          >
            {letter}
          </Text>
        );
      })}
    </group>
  );
}

export default function RotatingText() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <CurvedSealium />
    </Canvas>
  );
}
