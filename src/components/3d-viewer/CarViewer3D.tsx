import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { CarModel } from './CarModel';
import { SceneSetup } from './SceneSetup';
import { Hotspots } from './Hotspots';

interface CarViewer3DProps {
  carDetails?: {
    make?: string;
    model?: string;
    year?: number;
  };
  showHotspots?: boolean;
}

const CarViewer3D = ({ carDetails, showHotspots = false }: CarViewer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const { data: carData, isLoading } = useQuery({
    queryKey: ['car-data', carDetails?.make, carDetails?.model],
    queryFn: async () => {
      if (!carDetails?.make || !carDetails?.model) return null;
      const response = await fetch(
        `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${carDetails.make}&model=${carDetails.model}`,
        {
          headers: {
            'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
          },
        }
      );
      return response.json();
    },
    enabled: !!carDetails?.make && !!carDetails?.model,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    sceneRef.current = new THREE.Scene();
    
    // Setup camera
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current.position.set(3, 2, 5);

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    rendererRef.current.shadowMap.enabled = true;
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Add scene elements
    if (sceneRef.current) {
      // Setup scene, lights, and ground
      SceneSetup({ scene: sceneRef.current });
      
      // Add car model
      CarModel({ scene: sceneRef.current });
      
      // Add hotspots if enabled
      if (showHotspots) {
        Hotspots({ 
          scene: sceneRef.current, 
          carType: carDetails?.model || 'default',
          onHotspotHover: setActiveHotspot
        });
      }
    }

    // Add OrbitControls
    if (rendererRef.current && cameraRef.current) {
      controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      controlsRef.current.minDistance = 3;
      controlsRef.current.maxDistance = 10;
      controlsRef.current.maxPolarAngle = Math.PI / 2;
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      controlsRef.current?.dispose();
    };
  }, [showHotspots, carDetails]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div ref={containerRef} className="h-[400px] w-full relative">
        {activeHotspot && (
          <div className="absolute top-4 right-4 bg-black/75 text-white p-2 rounded">
            {activeHotspot}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CarViewer3D;