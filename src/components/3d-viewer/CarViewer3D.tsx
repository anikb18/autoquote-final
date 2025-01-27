import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { Loader2 } from "lucide-react";
import { Scene } from "./Scene";
import { CarModel } from "./CarModel";
import { Hotspots } from "./Hotspots";

interface CarViewer3DProps {
  carDetails?: {
    make?: string;
    model?: string;
    year?: number;
  };
  showHotspots?: boolean;
}

const CarViewer3D = ({
  carDetails,
  showHotspots = false,
}: CarViewer3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const handleHotspotHover = (label: string | null) => {
    setHoveredHotspot(label);
  };

  const [sceneState, setSceneState] = useState<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
  } | null>(null);

  const {
    data: carData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["car-data", carDetails?.make, carDetails?.model],
    queryFn: async () => {
      if (!carDetails?.make || !carDetails?.model) {
        console.warn("Missing car details:", carDetails);
        return null;
      }

      try {
        const response = await fetch(
          `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${carDetails.make.toLowerCase()}&model=${carDetails.model.toLowerCase()}`,
          {
            headers: {
              "x-rapidapi-host": "cars-by-api-ninjas.p.rapidapi.com",
              "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Car API response:", data);
        return data;
      } catch (error) {
        console.error("Error fetching car data:", error);
        return null;
      }
    },
    enabled: !!carDetails?.make && !!carDetails?.model,
  });

  useEffect(() => {
    if (!containerRef.current || !sceneState) return;

    const animate = () => {
      requestAnimationFrame(animate);
      sceneState.controls.update();
      sceneState.renderer.render(sceneState.scene, sceneState.camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !sceneState) return;

      sceneState.camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      sceneState.camera.updateProjectionMatrix();
      sceneState.renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sceneState]);

  const handleSceneReady = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    controls: OrbitControls,
  ) => {
    setSceneState({ scene, camera, renderer, controls });

    // Setup lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(ambientLight, directionalLight);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    console.error("Error in CarViewer3D:", error);
    return (
      <Card className="p-4">
        <div className="text-red-500">
          Error loading car model. Please try again later.
        </div>
      </Card>
    );
  }

  if (!carDetails?.make || !carDetails?.model) {
    return (
      <Card className="p-4">
        <div className="text-muted-foreground">No car details available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
      <div
        ref={containerRef}
        className="h-[400px] w-full relative rounded-lg overflow-hidden"
      >
        <Scene containerRef={containerRef} onSceneReady={handleSceneReady} />
        {sceneState && carData && (
          <CarModel scene={sceneState.scene} carData={carData} />
        )}
        {sceneState &&
          showHotspots &&
          carDetails?.make &&
          carDetails?.model && (
            <Hotspots
              scene={sceneState.scene}
              carType={`${carDetails.year} ${carDetails.make} ${carDetails.model}`}
              onHotspotHover={handleHotspotHover}
            />
          )}
      </div>
    </Card>
  );
};

export default CarViewer3D;
