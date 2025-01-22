import React, { useEffect } from 'react';
import * as THREE from 'three';

interface CarModelProps {
  scene: THREE.Scene;
  carData: any; // Expecting carData to be passed from CarViewer3D
}

export const CarModel = ({ scene, carData }: CarModelProps) => {
  useEffect(() => {
    if (!carData || carData.length === 0) {
      // Render a placeholder or handle no car data case
      console.warn('No car data available to display image.');
      return;
    }

    const carImageURL = carData[0].image; // Assuming the first result has the image

    if (carImageURL) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(carImageURL, (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(2 * aspectRatio, 2); // Adjust plane size
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const carImage = new THREE.Mesh(geometry, material);
        scene.add(carImage);

        // Clean up previous objects in the scene (optional, if needed)
        // scene.remove(scene.getObjectByName('carModel')); // Example: Remove previous car model
        carImage.name = 'carModel'; // Naming the mesh for potential removal later
      }, undefined, (error) => {
        console.error('Error loading car image texture:', error);
      });
    } else {
      console.warn('No car image URL found in car data.');
      // Optionally render a placeholder image here
    }

    return () => {
      // Clean up resources if needed on unmount
    };
  }, [scene, carData]);

  return null; // No visible component rendered directly
};
