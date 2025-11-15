'use client';

import { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface AvatarPreviewProps {
  avatarType: 'male' | 'female' | 'custom';
  customImage: string | null;
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised';
  isPlaying: boolean;
}

function Avatar3D({ avatarType, emotion, isPlaying }: { avatarType: string; emotion: string; isPlaying: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // Idle animation
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      headRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    }

    // Breathing effect
    meshRef.current.position.y = Math.sin(time * 2) * 0.02;

    // Eye blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(time * 3) < -0.95 ? 0.3 : 1;
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }

    // Lip sync when playing
    if (mouthRef.current && isPlaying) {
      const lipSync = Math.abs(Math.sin(time * 20)) * 0.3;
      mouthRef.current.scale.y = 1 + lipSync;
    }

    // Hand gestures
    if (leftArmRef.current && rightArmRef.current && isPlaying) {
      leftArmRef.current.rotation.z = Math.sin(time * 2) * 0.3 + 0.5;
      rightArmRef.current.rotation.z = Math.sin(time * 2 + Math.PI) * 0.3 - 0.5;
    }
  });

  // Emotion-based configurations
  const getEmotionConfig = () => {
    switch (emotion) {
      case 'happy':
        return { mouthY: 0.3, eyeScale: 1.2, color: '#FFD700' };
      case 'sad':
        return { mouthY: -0.3, eyeScale: 0.8, color: '#4169E1' };
      case 'angry':
        return { mouthY: 0, eyeScale: 0.7, color: '#DC143C' };
      case 'surprised':
        return { mouthY: 0.5, eyeScale: 1.5, color: '#FF69B4' };
      default:
        return { mouthY: 0, eyeScale: 1, color: '#FFA500' };
    }
  };

  const emotionConfig = getEmotionConfig();
  const skinColor = avatarType === 'male' ? '#FFDBAC' : '#FFE4C4';

  return (
    <group ref={meshRef}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.15, 1.6, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.15, 1.6, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 1.3 + emotionConfig.mouthY * 0.1, 0.4]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1, 32]} />
        <meshStandardMaterial color={emotionConfig.color} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.6, 0.8, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.6, 0.8, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1, 16]} />
        <meshStandardMaterial color="#1E90FF" />
      </mesh>
      <mesh position={[0.2, -0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1, 16]} />
        <meshStandardMaterial color="#1E90FF" />
      </mesh>
    </group>
  );
}

function CustomImageAvatar({ imageUrl, emotion, isPlaying }: { imageUrl: string; emotion: string; isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (loadedTexture) => {
      texture.current = loadedTexture;
      if (meshRef.current) {
        (meshRef.current.material as THREE.MeshStandardMaterial).map = loadedTexture;
        (meshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    });
  }, [imageUrl]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle head movement
    meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;

    // Breathing effect
    meshRef.current.position.y = Math.sin(time * 2) * 0.02;

    // Scale pulse when playing
    if (isPlaying) {
      const scale = 1 + Math.sin(time * 10) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function AvatarPreview({ avatarType, customImage, emotion, isPlaying }: AvatarPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative"
      style={{ height: '700px' }}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <span className="text-sm font-medium">{isPlaying ? 'Speaking...' : 'Ready'}</span>
      </div>

      {/* Emotion Display */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-sm font-medium">Emotion: {emotion}</span>
      </div>

      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {avatarType === 'custom' && customImage ? (
            <CustomImageAvatar imageUrl={customImage} emotion={emotion} isPlaying={isPlaying} />
          ) : (
            <Avatar3D avatarType={avatarType} emotion={emotion} isPlaying={isPlaying} />
          )}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}
