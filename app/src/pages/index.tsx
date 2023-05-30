import VoxelObject from "@/components/VoxelObject";
import { OrbitControls, OrthographicCamera, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";
import { NoToneMapping } from "three";

export default function Home() {
  return (
    <>
      <Head>
        <title>Voxel Engine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-screen">
        <Canvas
          gl={{ toneMapping: NoToneMapping }}
          linear
          className="bg-orange-100"
        >
          {true && (
            <OrthographicCamera makeDefault zoom={50} position={[0, 0, 200]} />
          )}
          <ambientLight intensity={0.25} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />
          <OrbitControls />
          <VoxelObject />
          {true && (
            <mesh>
              <boxGeometry />
              <meshStandardMaterial wireframe />
            </mesh>
          )}
          <Stats />
          <axesHelper args={[2]} />
        </Canvas>
      </main>
    </>
  );
}
