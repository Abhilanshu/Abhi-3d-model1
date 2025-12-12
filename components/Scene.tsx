import React, { useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, BakeShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Gallery } from './Gallery';
import { Artist } from './Artist';
import { useGallery } from '../store';

const CameraController: React.FC = () => {
  const { camera, scene } = useThree();
  const { currentArtwork } = useGallery();
  
  // We keep track of where the camera is looking to smooth the transition
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, -5));

  useFrame((state, delta) => {
    const artist = scene.getObjectByName('artist-char');
    if (!artist) return;

    let targetPos = new THREE.Vector3();
    let targetLook = new THREE.Vector3();

    if (currentArtwork) {
      // --- INSPECT MODE ---
      // Similar logic to before: Find a nice spot in front of the artwork
      const artPos = new THREE.Vector3(...currentArtwork.position);
      const rotationY = currentArtwork.rotation[1];
      const distance = 3.5;
      
      const offsetX = Math.sin(rotationY) * distance;
      const offsetZ = Math.cos(rotationY) * distance;

      // Position: In front of painting, slightly offset to frame the artist who is leaning in
      targetPos.set(
        artPos.x + offsetX + (Math.cos(rotationY) * 1.0),
        artPos.y, 
        artPos.z + offsetZ - (Math.sin(rotationY) * 1.0)
      );

      // Look At: The center of the artwork
      targetLook.copy(artPos);

    } else {
      // --- ROAM MODE ---
      // Follow the artist from a comfortable top-down/third-person view
      // We add a fixed offset to the artist's position
      const followOffset = new THREE.Vector3(0, 3, 6);
      targetPos.copy(artist.position).add(followOffset);

      // Look At: The artist's upper body
      targetLook.copy(artist.position).add(new THREE.Vector3(0, 1.5, 0));
    }

    // Smoothly interpolate camera position and orientation
    // Using a lower lerp factor for position gives a "heavy", cinematic camera feel
    state.camera.position.lerp(targetPos, delta * 2.5);
    
    // Smoothly interpolate the LookAt target
    currentLookAt.current.lerp(targetLook, delta * 3);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
};

export const Scene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 4, 10], fov: 45 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <fog attach="fog" args={['#1a1816', 5, 25]} />
      <color attach="background" args={['#1a1816']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#faedcd" />
      <spotLight
        position={[5, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-bias={-0.0001}
        color="#fff0d0"
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#d4a373" />

      <Artist />
      <Gallery />
      <CameraController />
      
      <Environment preset="city" />
      <BakeShadows />
    </Canvas>
  );
};
