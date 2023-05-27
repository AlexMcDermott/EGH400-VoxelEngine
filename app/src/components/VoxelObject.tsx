import fragmentShader from "raw-loader!glslify-loader!../shaders/fragment.fs";
import vertexShader from "raw-loader!glslify-loader!../shaders/vertex.vs";
import { useMemo } from "react";
import { Data3DTexture, RedFormat } from "three";

const VoxelObject = () => {
  const uniforms = useMemo(() => {
    const size = 10;
    const voxels = new Uint8Array(size * size * size);

    let i = 0;
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          // const isFilled = x * x + y * y + z * z <= radius * radius;
          const radius = size / 2;
          const dx = x - radius;
          const dy = y - radius;
          const dz = z - radius;

          const inCircle = dx * dx + dy * dy + dz * dz <= radius * radius;
          const isFilled = inCircle ? 255 : 0;
          voxels[i] = isFilled;
          i++;
        }
      }
    }

    const texture = new Data3DTexture(voxels, size, size, size);
    texture.format = RedFormat;
    texture.needsUpdate = true;

    const uniforms = { voxels: { value: texture } };
    return uniforms;
  }, []);

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
