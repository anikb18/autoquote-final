import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { Tooltip } from '../ui/tooltip';

interface CarViewer3DProps {
  carDetails?: {
    make?: string;
    model?: string;
    year?: number;
  };
  showHotspots?: boolean;
}

interface Hotspot {
  position: THREE.Vector3;
  label: string;
  description: string;
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
    sceneRef.current.background = new THREE.Color(0xf0f0f0);

    // Setup camera
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

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
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
    sceneRef.current.add(ambientLight, directionalLight, hemisphereLight);

    // Add car model (enhanced placeholder)
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00,
      specular: 0x555555,
      shininess: 30 
    });
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

    const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carBody.castShadow = true;
    carBody.receiveShadow = true;

    // Add wheels
    const wheels = [];
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
      wheels.push(wheel);
      sceneRef.current?.add(wheel);
    });

    sceneRef.current.add(carBody);

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
    sceneRef.current.add(ground);

    // Position camera
    cameraRef.current.position.z = 5;
    cameraRef.current.position.y = 2;
    cameraRef.current.position.x = 3;

    // Add OrbitControls
    if (rendererRef.current) {
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
    <Card className="p-4 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
      <div ref={containerRef} className="h-[400px] w-full relative rounded-lg overflow-hidden">
        {activeHotspot && (
          <div className="absolute top-4 right-4 bg-background/75 backdrop-blur-sm border border-border/50 text-foreground p-2 rounded-lg shadow-lg animate-fade-in">
            {activeHotspot}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CarViewer3D;