import ReferenceObject from "@/components/ReferenceObject";
import VoxelObject from "@/components/VoxelObject";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { useMemo } from "react";

export interface Voxel {
  position: [number, number, number];
  size: number;
  isFilled: 0 | 1;
}

const generateVoxelSphereUniforms = (
  cubeSize: number,
  targetDiameterInVoxels: number
) => {
  const radius = cubeSize / 2;
  const diameterInVoxels = Math.ceil(targetDiameterInVoxels) | 1;
  const voxelSize = cubeSize / diameterInVoxels;
  const halfVoxelSize = voxelSize / 2;
  const lowerLimit = radius - halfVoxelSize;
  const upperLimit = radius + halfVoxelSize;

  const voxels = [];
  for (let x = -lowerLimit; x < upperLimit; x += voxelSize) {
    for (let y = -lowerLimit; y < upperLimit; y += voxelSize) {
      for (let z = -lowerLimit; z < upperLimit; z += voxelSize) {
        const isFilled = x * x + y * y + z * z <= radius * radius;
        const voxel: Voxel = {
          position: [x, y, z],
          size: voxelSize,
          isFilled: isFilled ? 1 : 0,
        };
        voxels.push(voxel);
      }
    }
  }

  return voxels;
};

export default function Home() {
  const targetDiameterInVoxels = 3;
  const voxels = useMemo(
    () => generateVoxelSphereUniforms(1, targetDiameterInVoxels),
    [targetDiameterInVoxels]
  );

  console.log(voxels.length);

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
          {true && <VoxelObject data={voxels} />}
          {false && <ReferenceObject data={voxels} />}
          <axesHelper args={[2]} />
        </Canvas>
      </main>
    </>
  );
}
