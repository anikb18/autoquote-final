import * as THREE from "three";

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
  console.log("Hotspots component rendered"); // Add console log
  const fetchHotspotInfo = async (carType: string): Promise<Hotspot[]> => {
    try {
      const response = await fetch("https://api.gemini.com/v1/hotspots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          carType: carType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotspot information");
      }

      const data = await response.json();
      return data.hotspots.map((hotspot: any) => ({
        position: new THREE.Vector3(
          hotspot.position.x,
          hotspot.position.y,
          hotspot.position.z,
        ),
        label: hotspot.label,
        description: hotspot.description,
      }));
    } catch (error) {
      console.error("Error fetching hotspot information:", error);
      return [];
    }
  };

  const getHotspots = async (carType: string): Promise<Hotspot[]> => {
    const hotspots = await fetchHotspotInfo(carType);
    return hotspots;
  };

  const hotspots = getHotspots(carType);
  hotspots.then((hotspots) => {
    hotspots.forEach(({ position, label }) => {
      const hotspotGeometry = new THREE.SphereGeometry(0.1);
      const spotlight = new THREE.SpotLight(0xffffff, 5); // Increased intensity
      spotlight.position.copy(position).setY(3); // Slightly higher position
      spotlight.target.position.copy(position);
      spotlight.angle = Math.PI / 4; // Wider cone angle
      spotlight.penumbra = 0.3; // Soften edges slightly
      spotlight.decay = 2;
      spotlight.distance = 10; // Increased range
      spotlight.castShadow = true;
      spotlight.shadow.mapSize.width = 1024; // Improve shadow quality
      spotlight.shadow.mapSize.height = 1024;
      spotlight.shadow.camera.near = 0.5;
      spotlight.shadow.camera.far = 15;
      scene.add(spotlight);
      scene.add(spotlight.target);
    });
  });

  return null;
};
