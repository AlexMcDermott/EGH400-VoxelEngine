import { useMemo } from "react";
import { Data3DTexture, IUniform, RedFormat } from "three";

import fragmentShader from "raw-loader!glslify-loader!../shaders/fragment.fs";
import vertexShader from "raw-loader!glslify-loader!../shaders/vertex.vs";

type VoxelUniform = { [uniform: string]: IUniform };

const VoxelObject = () => {
  const uniforms = useMemo(() => {
    const targetResolution = 21;
    const resolution = targetResolution | 1;
    const maxSteps = 100;
    const stepSize = 0.01;
    const voxelSize = 1 / resolution;
    const data = new Uint8Array(resolution * resolution * resolution);

    let i = 0;
    for (let z = 0; z < resolution; z++) {
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const radius = (resolution - 1) / 2;
          const dx = x - radius;
          const dy = y - radius;
          const dz = z - radius;
          const isFilled = dx * dx + dy * dy + dz * dz <= radius * radius;
          data[i++] = isFilled ? 1 : 0;
        }
      }
    }

    const texture = new Data3DTexture(data, resolution, resolution, resolution);
    texture.format = RedFormat;
    texture.needsUpdate = true;

    return {
      resolution: { value: resolution },
      maxSteps: { value: maxSteps },
      stepSize: { value: stepSize },
      voxelSize: { value: voxelSize },
      voxels: { value: texture },
    } satisfies VoxelUniform;
  }, []);

  return (
    <mesh>
      <boxGeometry />
      <rawShaderMaterial
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default VoxelObject;
