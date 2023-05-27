import { Voxel } from "@/pages";

interface ReferenceObjectProps {
  data: Voxel[];
}

const ReferenceObject = ({ data }: ReferenceObjectProps) => {
  return (
    <group>
      {data.map((voxel, i) => {
        const { position, size, isFilled } = voxel;
        return (
          <mesh key={i} position={position}>
            <boxGeometry args={[size, size, size]} />
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
