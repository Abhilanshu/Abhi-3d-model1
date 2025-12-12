import React, { useRef, useState } from 'react';
import { Image as DreiImage, Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { ARTWORKS } from '../constants';
import { useGallery } from '../store';
import { Artwork } from '../types';

interface FrameProps {
  artwork: Artwork;
  onSelect: (art: Artwork) => void;
  isSelected: boolean;
}

const Frame: React.FC<FrameProps> = ({ artwork, onSelect, isSelected }) => {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  
  useCursor(hovered && !isSelected);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(artwork);
  };

  return (
    <group
      ref={meshRef}
      position={new THREE.Vector3(...artwork.position)}
      rotation={new THREE.Euler(...artwork.rotation)}
    >
      {/* Frame Structure */}
      <mesh position={[0, 0, -0.05]} receiveShadow castShadow onClick={handleClick} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <boxGeometry args={[artwork.dimensions[0] + 0.2, artwork.dimensions[1] + 0.2, 0.1]} />
        <meshStandardMaterial color="#2a2826" roughness={0.8} />
      </mesh>

      {/* The Artwork Image */}
      <DreiImage
        url={artwork.imageUrl}
        scale={[artwork.dimensions[0], artwork.dimensions[1]] as [number, number]}
        position={[0, 0, 0.01]} // Slightly in front of frame
        transparent
        opacity={1}
      />
      
      {/* Spotlight for the art */}
      <spotLight
        position={[0, 2, 2]}
        target={meshRef.current || undefined}
        intensity={isSelected ? 3 : 0.5}
        angle={0.6}
        penumbra={0.5}
        distance={10}
        color="#ffffff"
      />

      {/* Title Tag */}
      <group position={[0, -artwork.dimensions[1] / 2 - 0.3, 0]}>
        <Text
          fontSize={0.1}
          color="#faedcd"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        >
          {artwork.title.toUpperCase()}
        </Text>
        <Text
          fontSize={0.06}
          color="#888"
          position={[0, -0.15, 0]}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        >
          {artwork.artist}
        </Text>
      </group>
    </group>
  );
};

export const Gallery: React.FC = () => {
  const { currentArtwork, selectArtwork } = useGallery();

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#3d342b" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Paintings */}
      {ARTWORKS.map((art) => (
        <Frame
          key={art.id}
          artwork={art}
          onSelect={selectArtwork}
          isSelected={currentArtwork?.id === art.id}
        />
      ))}
    </group>
  );
};
