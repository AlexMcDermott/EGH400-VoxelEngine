import fragmentShader from "raw-loader!glslify-loader!../shaders/fragment.glsl";
import vertexShader from "raw-loader!glslify-loader!../shaders/vertex.glsl";

interface VoxelObjectProps {
  data: number[][];
}

// @refresh reset
const VoxelObject = ({ data }: VoxelObjectProps) => {
  return (
    <mesh>
      <boxGeometry />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default VoxelObject;
