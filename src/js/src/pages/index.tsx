import ReferenceObject from "@/components/ReferenceObject";
import VoxelObject from "@/components/VoxelObject";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { useMemo } from "react";

const generateVoxelSphere = (
  cubeSize: number,
  targetDiameterInVoxels: number
) => {
  const radius = cubeSize / 2;
  const voxelDiameter = Math.ceil(targetDiameterInVoxels) | 1;
  const voxelSize = cubeSize / voxelDiameter;
  const halfVoxelSize = voxelSize / 2;
  const lowerLimit = radius - halfVoxelSize;
  const upperLimit = radius + halfVoxelSize;

  const voxelSphere = [];
  for (let x = -lowerLimit; x <= upperLimit; x += voxelSize) {
    for (let y = -lowerLimit; y <= upperLimit; y += voxelSize) {
      for (let z = -lowerLimit; z <= upperLimit; z += voxelSize) {
        const isFilled = x * x + y * y + z * z <= radius * radius;
        voxelSphere.push([x, y, z, voxelSize, isFilled ? 1 : 0]);
      }
    }
  }

  return voxelSphere;
};

export default function Home() {
  const targetDiameterInVoxels = 5;
  const sphere = useMemo(
    () => generateVoxelSphere(1, targetDiameterInVoxels),
    [targetDiameterInVoxels]
  );

  return (
    <>
      <Head>
        <title>Voxel Engine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-screen">
        <Canvas className="bg-orange-100">
          <ambientLight intensity={0.25} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />
          <OrbitControls />
          <Stats />
          {false && <VoxelObject data={sphere} />}
          <ReferenceObject data={sphere} />
          <axesHelper args={[2]} />
        </Canvas>
      </main>
    </>
  );
}
