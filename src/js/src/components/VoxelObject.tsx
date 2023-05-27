import { Voxel } from "@/pages";
import { useMemo } from "react";

import fragmentShader from "raw-loader!glslify-loader!../shaders/fragment.fs";
import vertexShader from "raw-loader!glslify-loader!../shaders/vertex.vs";

interface VoxelObjectProps {
  data: Voxel[];
}

const VoxelObject = ({ data }: VoxelObjectProps) => {
  const uniforms = useMemo(() => ({ data: { value: data } }), [data]);

  return (
    <mesh>
      <boxGeometry />
      <rawShaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default VoxelObject;
