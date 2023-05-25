import VoxelObject from "@/components/VoxelObject";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { useMemo } from "react";

// Write a function that generates a 1D array that represents a 3D voxel sphere centred at the origin with radius 0.5
const generateVoxelSphere = (radius: number) => {
  const voxelSphere = [];
  for (let x = -radius; x <= radius; x += 0.1) {
    for (let y = -radius; y <= radius; y += 0.1) {
      for (let z = -radius; z <= radius; z += 0.1) {
        const isFilled = x * x + y * y + z * z <= radius * radius;
        voxelSphere.push([x, y, z, isFilled ? 1 : 0]);
      }
    }
  }
  return voxelSphere;
};

// @refresh reset
export default function Home() {
  const sphere = useMemo(() => generateVoxelSphere(0.5), []);

  return (
    <>
      <Head>
        <title>Alex McDermott</title>
        <meta name="description" content="Welcome to my portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-screen">
        <Canvas className="bg-orange-100">
          <ambientLight intensity={0.25} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />
          <OrbitControls />
          <Stats />
          {sphere.map((data, i) => (
            <VoxelObject key={i} data={data} />
          ))}
          <axesHelper args={[2]} />
        </Canvas>
      </main>
    </>
  );
}
