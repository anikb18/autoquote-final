import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';

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
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    sceneRef.current.add(ambientLight);
    sceneRef.current.add(directionalLight);

    // Add car model placeholder (cube for now)
    const geometry = new THREE.BoxGeometry(2, 1, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const carMesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(carMesh);

    // Position camera
    cameraRef.current.position.z = 5;
    cameraRef.current.position.y = 2;

    // Add hotspots if enabled
    if (showHotspots) {
      const hotspotPositions = [
        { x: 1, y: 0.5, z: 2, label: 'Engine' },
        { x: -1, y: 0.5, z: -2, label: 'Trunk' },
        { x: 1, y: 0.5, z: 0, label: 'Door' },
      ];

      hotspotPositions.forEach(({ x, y, z, label }) => {
        const hotspotGeometry = new THREE.SphereGeometry(0.1);
        const hotspotMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
        hotspot.position.set(x, y, z);
        sceneRef.current?.add(hotspot);
      });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Cleanup
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [showHotspots]);

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
      <div ref={containerRef} className="h-[400px] w-full" />
    </Card>
  );
};

export default CarViewer3D;