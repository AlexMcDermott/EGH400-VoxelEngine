interface ReferenceObjectProps {
  data: number[][];
}

const ReferenceObject = ({ data }: ReferenceObjectProps) => {
  return (
    <group>
      {data.map((voxel, i) => {
        const position = voxel.slice(0, 3) as [number, number, number];
        const voxelSize = voxel[3];
        const isFilled = voxel[4];
        return (
          <mesh key={i} position={position}>
            <boxGeometry args={[voxelSize, voxelSize, voxelSize]} />
            <meshPhongMaterial
              color="red"
              transparent={true}
              opacity={isFilled}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default ReferenceObject;
