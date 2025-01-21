import * as THREE from 'three';

interface CarModelProps {
  scene: THREE.Scene;
  color?: string;
}

export const CarModel = ({ scene, color = '#00ff00' }: CarModelProps) => {
  // Create car body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color,
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

  // Add ground plane
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xcccccc,
    side: THREE.DoubleSide 
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);

  return null;
};