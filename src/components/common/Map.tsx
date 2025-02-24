import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  setCoordinates?: (lat: number, lng: number) => void;  // Tambahkan setCoordinates sebagai props opsional
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude = -7.5596, longitude = 110.8253, setCoordinates }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // Cegah inisialisasi ulang

    if (mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Tambahkan event listener untuk menangkap klik di peta
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        if (setCoordinates) {
          setCoordinates(e.latlng.lat, e.latlng.lng);  // Panggil setCoordinates jika tersedia
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, setCoordinates]); // Tambahkan dependencies

  return <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;
