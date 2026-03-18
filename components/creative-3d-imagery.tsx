'use client';

import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, TorusKnot, OrbitControls } from '@react-three/drei';

export function Creative3DImagery() {
  return (
    <div className="w-full h-96 bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <TorusKnot args={[1, 0.3, 128, 32]}>
            <MeshDistortMaterial
              color="#3b82f6"
              attach="material"
              distort={0.2}
              speed={1}
              roughness={0.1}
              metalness={0.8}
            />
          </TorusKnot>
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
