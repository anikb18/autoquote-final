import * as THREE from 'three';

interface CarModelProps {
  scene: THREE.Scene;
}

export const CarModel = ({ scene }: CarModelProps) => {
  // Create car body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,
    specular: 0x555555,
    shininess: 30 
  });
  const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
  carBody.castShadow = true;
  carBody.receiveShadow = true;

  // Add wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const wheelPositions = [
    { x: -1, y: -0.5, z: 1.5 },
    { x: 1, y: -0.5, z: 1.5 },
    { x: -1, y: -0.5, z: -1.5 },
    { x: 1, y: -0.5, z: -1.5 },
  ];

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    scene.add(wheel);
  });

  scene.add(carBody);
  
  return null;
};