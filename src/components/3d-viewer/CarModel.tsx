import React, { useEffect } from 'react';
import * as THREE from 'three';

interface CarModelProps {
  scene: THREE.Scene;
  carData: any;
}

export const CarModel = ({ scene, carData }: CarModelProps) => {
  useEffect(() => {
    if (!carData || carData.length === 0) {
      console.warn('No car data available to display model.');
      return;
    }

    // Create a default car representation (a simple box for now)
    const geometry = new THREE.BoxGeometry(2, 1, 4); // Basic car-like proportions
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x446df6, // Using the brand blue color
      metalness: 0.7,
      roughness: 0.3,
    });
    
    const carMesh = new THREE.Mesh(geometry, material);
    carMesh.castShadow = true;
    carMesh.receiveShadow = true;
    carMesh.name = 'carModel';
    
    // Remove any existing car model
    const existingModel = scene.getObjectByName('carModel');
    if (existingModel) {
      scene.remove(existingModel);
    }
    
    scene.add(carMesh);

    // Position the car
    carMesh.position.set(0, 0, 0);
    
    return () => {
      // Cleanup
      scene.remove(carMesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, carData]);

  return null;
};