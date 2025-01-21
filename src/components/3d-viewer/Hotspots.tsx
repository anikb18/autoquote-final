import * as THREE from 'three';

interface Hotspot {
  position: THREE.Vector3;
  label: string;
  description: string;
}

interface HotspotsProps {
  scene: THREE.Scene;
  carType: string;
  onHotspotHover: (label: string | null) => void;
}

export const Hotspots = ({ scene, carType, onHotspotHover }: HotspotsProps) => {
  const getHotspots = (carType: string): Hotspot[] => {
    return [
      {
        position: new THREE.Vector3(1, 0.5, 2),
        label: 'Engine',
        description: 'High-performance engine with advanced cooling system',
      },
      {
        position: new THREE.Vector3(-1, 0.5, -2),
        label: 'Trunk',
        description: 'Spacious cargo area with smart storage solutions',
      },
      {
        position: new THREE.Vector3(1, 0.5, 0),
        label: 'Door',
        description: 'Reinforced side impact protection system',
      },
      {
        position: new THREE.Vector3(0, 1.2, 0),
        label: 'Roof',
        description: 'Panoramic sunroof with UV protection',
      },
    ];
  };

  const hotspots = getHotspots(carType);
  hotspots.forEach(({ position, label }) => {
    const hotspotGeometry = new THREE.SphereGeometry(0.1);
    const hotspotMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
    hotspot.position.copy(position);
    hotspot.userData = { label };
    scene.add(hotspot);
  });

  return null;
};