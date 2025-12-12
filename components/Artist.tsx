import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGallery } from '../store';

// Abstract representation of an artist since we don't have external assets.
// Composed of geometric shapes to look like a modern art sculpture or a stylized mannequin.
export const Artist: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  
  const { currentArtwork } = useGallery();
  
  // State for animation logic
  const positionRef = useRef(new THREE.Vector3(0, 0, 2)); // Start position
  const rotationRef = useRef(0); // Y rotation
  const isWalking = useRef(false);

  // Keyboard State
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: false }));

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Constants
  const WALK_SPEED = 0.08;
  const ARRIVAL_THRESHOLD = 0.1;

  useFrame((state) => {
    if (!group.current) return;

    let targetPos = new THREE.Vector3();
    let targetRot = rotationRef.current;
    let shouldWalk = false;

    if (currentArtwork) {
      // --- AUTO-WALK TO PAINTING ---
      
      // Logic to find standing position in front of artwork
      const artPos = new THREE.Vector3(...currentArtwork.position);
      const artRot = currentArtwork.rotation[1];
      
      const standDistance = 2.0;
      const sideOffset = -0.8; 

      const normalX = Math.sin(artRot);
      const normalZ = Math.cos(artRot);
      const rightX = Math.cos(artRot);
      const rightZ = -Math.sin(artRot);

      targetPos.set(
        artPos.x + (normalX * standDistance) + (rightX * sideOffset),
        0,
        artPos.z + (normalZ * standDistance) + (rightZ * sideOffset)
      );

      // Face the painting
      const dx = artPos.x - targetPos.x;
      const dz = artPos.z - targetPos.z;
      targetRot = Math.atan2(dx, dz);

      // Move logic (Lerp to target)
      const dist = positionRef.current.distanceTo(targetPos);
      if (dist > ARRIVAL_THRESHOLD) {
        shouldWalk = true;
        const dir = new THREE.Vector3().subVectors(targetPos, positionRef.current).normalize();
        positionRef.current.add(dir.multiplyScalar(WALK_SPEED));
        
        // Face walking direction while moving
        const walkAngle = Math.atan2(dir.x, dir.z);
        let deltaRot = walkAngle - rotationRef.current;
        while (deltaRot > Math.PI) deltaRot -= Math.PI * 2;
        while (deltaRot < -Math.PI) deltaRot += Math.PI * 2;
        rotationRef.current += deltaRot * 0.1;
      } else {
        // Arrived: Rotate to final facing angle
        let deltaRot = targetRot - rotationRef.current;
        while (deltaRot > Math.PI) deltaRot -= Math.PI * 2;
        while (deltaRot < -Math.PI) deltaRot += Math.PI * 2;
        rotationRef.current += deltaRot * 0.05;
      }

    } else {
      // --- MANUAL CONTROL ---
      
      const direction = new THREE.Vector3(0, 0, 0);
      if (keys['ArrowUp'] || keys['KeyW']) direction.z -= 1;
      if (keys['ArrowDown'] || keys['KeyS']) direction.z += 1;
      if (keys['ArrowLeft'] || keys['KeyA']) direction.x -= 1;
      if (keys['ArrowRight'] || keys['KeyD']) direction.x += 1;

      if (direction.lengthSq() > 0) {
        shouldWalk = true;
        direction.normalize().multiplyScalar(WALK_SPEED);
        
        // Calculate potential new position
        const newPos = positionRef.current.clone().add(direction);
        
        // Simple Bounds Check (Gallery Floor)
        if (newPos.x > -20 && newPos.x < 20 && newPos.z > -20 && newPos.z < 10) {
            positionRef.current.copy(newPos);
        }

        // Rotate towards direction
        const targetAngle = Math.atan2(direction.x, direction.z);
        let deltaRot = targetAngle - rotationRef.current;
        while (deltaRot > Math.PI) deltaRot -= Math.PI * 2;
        while (deltaRot < -Math.PI) deltaRot += Math.PI * 2;
        rotationRef.current += deltaRot * 0.15; // Faster turn for manual control
      }
    }

    isWalking.current = shouldWalk;

    // Apply to group
    group.current.position.copy(positionRef.current);
    group.current.rotation.y = rotationRef.current;

    // Procedural Animation (Bobbing / Breathing)
    const time = state.clock.getElapsedTime();
    
    if (bodyRef.current && headRef.current && rightArmRef.current && leftArmRef.current) {
      if (isWalking.current) {
        // Walk Cycle
        const freq = 15;
        const amp = 0.05;
        bodyRef.current.position.y = 0.75 + Math.sin(time * freq) * amp;
        
        // Arms swinging
        rightArmRef.current.rotation.x = Math.sin(time * freq) * 0.5;
        leftArmRef.current.rotation.x = Math.cos(time * freq) * 0.5;
        
        // Head slight bob
        headRef.current.rotation.x = Math.sin(time * freq * 2) * 0.05;

      } else {
        // Idle / Inspect Cycle
        // Breathing
        const breathFreq = 2;
        bodyRef.current.position.y = 0.75 + Math.sin(time * breathFreq) * 0.01;
        
        // Inspect animation: Lean forward if artwork selected and not walking
        if (currentArtwork && !isWalking.current) {
           // Lean in
           const leanAmount = 0.2;
           bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, leanAmount, 0.05);
           
           // Arm gesture (pointing)
           rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.5, 0.05); // Up
           rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.2, 0.05); // In
           
        } else {
           // Reset pose
           bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.05);
           rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.05);
           rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.05);
        }
        
        // Always reset left arm
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.05);
      }
    }

  });

  // Materials
  const smockMaterial = new THREE.MeshStandardMaterial({ color: '#e0cda7', roughness: 0.9 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: '#d4a373', roughness: 0.6 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: '#2a2826', roughness: 0.8 });

  return (
    <group ref={group} name="artist-char" dispose={null}>
      {/* Shadow Blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="black" transparent opacity={0.3} />
      </mesh>

      {/* Body Group (Pivot at hips) */}
      <group position={[0, 0, 0]}>
        
        {/* Torso/Smock */}
        <mesh ref={bodyRef} position={[0, 0.75, 0]} castShadow receiveShadow material={smockMaterial}>
           <capsuleGeometry args={[0.25, 0.6, 4, 8]} />
        </mesh>

        {/* Head */}
        <mesh ref={headRef} position={[0, 1.45, 0]} castShadow receiveShadow material={skinMaterial}>
           <sphereGeometry args={[0.15, 32, 32]} />
           {/* Beret */}
           <mesh position={[0.05, 0.12, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
              <meshStandardMaterial color="#4a4036" />
           </mesh>
        </mesh>
        
        {/* Right Arm Pivot */}
        <group ref={rightArmRef} position={[0.3, 1.3, 0]}>
           <mesh position={[0, -0.35, 0]} castShadow material={smockMaterial}>
             <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
           </mesh>
           {/* Brush */}
           <mesh position={[0, -0.75, 0.1]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
             <meshStandardMaterial color="#8B4513" />
           </mesh>
        </group>

        {/* Left Arm Pivot */}
        <group ref={leftArmRef} position={[-0.3, 1.3, 0]}>
           <mesh position={[0, -0.35, 0]} castShadow material={smockMaterial}>
             <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
           </mesh>
           {/* Palette */}
            <mesh position={[0, -0.6, 0.2]} rotation={[Math.PI/2, 0, Math.PI/4]}>
             <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
             <meshStandardMaterial color="#d2b48c" />
           </mesh>
        </group>

        {/* Legs (Simplified as static for this procedural style, moving with body bob) */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[0.15, -0.2, 0]} castShadow material={darkMaterial}>
             <cylinderGeometry args={[0.09, 0.08, 0.7, 16]} />
          </mesh>
           <mesh position={[-0.15, -0.2, 0]} castShadow material={darkMaterial}>
             <cylinderGeometry args={[0.09, 0.08, 0.7, 16]} />
          </mesh>
        </group>

      </group>
    </group>
  );
};
