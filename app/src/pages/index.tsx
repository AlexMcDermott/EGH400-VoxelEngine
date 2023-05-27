import VoxelObject from "@/components/VoxelObject";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";

export default function Home() {
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
          <VoxelObject />
          {false && (
            <mesh>
              <boxGeometry />
              <meshStandardMaterial transparent opacity={0.5} />
            </mesh>
          )}
          <Stats />
          <axesHelper args={[2]} />
        </Canvas>
      </main>
    </>
  );
}
