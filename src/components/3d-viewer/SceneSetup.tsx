import * as THREE from 'three';

interface SceneSetupProps {
  scene: THREE.Scene;
}

export const SceneSetup = ({ scene }: SceneSetupProps) => {
  // Setup scene background
  scene.background = new THREE.Color(0xf0f0f0);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(1, 1, 1);
  directionalLight.castShadow = true;
  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
  
  scene.add(ambientLight, directionalLight, hemisphereLight);

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