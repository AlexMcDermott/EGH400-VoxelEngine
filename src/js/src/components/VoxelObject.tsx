import { useFrame } from "@react-three/fiber";

// import fragmentShader from "raw-loader!glslify-loader!../shaders/fragment.glsl";
// import vertexShader from "raw-loader!glslify-loader!../shaders/vertex.glsl";

// @refresh reset
const VoxelObject = ({ data }: { data: any }) => {
  useFrame((state) => {
    // console.log(state.camera.position, state.clock.getElapsedTime());
  });

  return (
    <mesh position={data.slice(0, -1)}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshPhongMaterial color="red" transparent={true} opacity={data[3]} />
      {/* <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      /> */}
    </mesh>
  );
};

export default VoxelObject;
