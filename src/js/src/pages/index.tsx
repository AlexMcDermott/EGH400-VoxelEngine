import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Head from "next/head";

import fragmentShader from "raw-loader!glslify-loader!../shaders/fragment.glsl";
import vertexShader from "raw-loader!glslify-loader!../shaders/vertex.glsl";

export default function Home() {
  return (
    <>
      <Head>
        <title>Alex McDermott</title>
        <meta name="description" content="Welcome to my portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="h-screen">
        <Canvas className="bg-orange-100">
          <mesh>
            <boxGeometry />
            <shaderMaterial
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
            />
          </mesh>
          <OrbitControls />
          <Stats />
        </Canvas>
      </main>
    </>
  );
}
