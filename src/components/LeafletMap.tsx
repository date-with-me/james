import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L, { LatLngBounds } from "leaflet";

export type LegendItem = {
  color: string;
  description: string;
};

export type LookingInMapProps = {
  data: string; // URL/path to GeoJSON (e.g. "/assets/area.geojson")
  theme: (row: any, feature?: GeoJSON.Feature) => string; // returns a color (hex/rgb)
  legend: LegendItem[];
  className?: string;
  heightPx?: number; // map height in pixels
  legendTitle?: string;
  // View configuration
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  // If provided, initializes view to these bounds
  bounds?: [[number, number], [number, number]];
  // Constrain panning to these bounds
  maxBounds?: [[number, number], [number, number]];
  // Enable/disable scroll wheel zooming
  scrollWheelZoom?: boolean;
  // Auto-fit to loaded GeoJSON (ignored if bounds prop provided)
  autoFitDataBounds?: boolean;
};

function hexToRgba(color: string, alpha: number): string {
  // If already rgba or rgb, just inject alpha if possible
  const trimmed = color.trim();
  if (trimmed.startsWith("rgba(")) return trimmed;
  if (trimmed.startsWith("rgb(")) {
    const inside = trimmed.slice(4, -1); // r,g,b
    return `rgba(${inside}, ${alpha})`;
  }

  // Handle #RGB or #RRGGBB
  let r = 255, g = 255, b = 0;
  const hex = trimmed.replace("#", "");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function FitBoundsOnData({ geojson }: { geojson: GeoJSON.FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geojson) return;
    try {
      const layer = L.geoJSON(geojson);
      const bounds: LatLngBounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (e) {
      // no-op
    }
  }, [geojson, map]);
  return null;
}

function InvalidateSizeOnResize() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const invalidate = () => map.invalidateSize();
    // Run after mount
    const t = setTimeout(invalidate, 0);
    // Observe container size changes
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => invalidate());
      ro.observe(container);
    }
    // Window resize fallback
    window.addEventListener("resize", invalidate);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", invalidate);
      if (ro) ro.disconnect();
    };
  }, [map]);
  return null;
}

export function LookingInMap({ data, theme, legend, className, heightPx = 250, legendTitle = "Legend", center = [52.5, -1.5], zoom = 8, minZoom, maxZoom, bounds, maxBounds, scrollWheelZoom = true, autoFitDataBounds = true }: LookingInMapProps) {
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(data, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch GeoJSON: ${res.status}`);
        const json = (await res.json()) as GeoJSON.FeatureCollection;
        if (isActive) setGeojson(json);
      } catch (_err) {
        // swallow
      }
    };
    load();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [data]);

  const styleFn = useMemo(() => {
    return (feature?: GeoJSON.Feature) => {
      const properties = feature?.properties ?? {};
      let baseColor = "#F59E0B";
      try {
        baseColor = theme(properties, feature);
      } catch (_err) {
        // default color if theme throws
      }
      return {
        color: hexToRgba(baseColor, 0.9),
        weight: 1.25,
        opacity: 0.9,
        fillColor: hexToRgba(baseColor, 0.35),
        fillOpacity: 0.35,
      } as L.PathOptions;
    };
  }, [theme]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <div className="rounded-lg overflow-hidden shadow" style={{ height: heightPx }}>
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            {...(bounds ? { bounds } : { center, zoom })}
            {...(typeof minZoom === "number" ? { minZoom } : {})}
            {...(typeof maxZoom === "number" ? { maxZoom } : {})}
            {...(maxBounds ? { maxBounds } : {})}
            scrollWheelZoom={scrollWheelZoom}
            wheelDebounceTime={20}
            wheelPxPerZoomLevel={100}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geojson && (
              <>
                <GeoJSON data={geojson as any} style={styleFn as any} />
                {autoFitDataBounds && !bounds && <FitBoundsOnData geojson={geojson} />}
              </>
            )}
            <InvalidateSizeOnResize />
          </MapContainer>
        </div>

        <div className="flex flex-col">
          <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">{legendTitle}</div>
          <ul className="space-y-2 overflow-auto pr-1">
            {legend.map((item, idx) => (
              <li key={`${item.color}-${idx}`} className="flex items-start gap-3">
                <span
                  className="inline-block w-5 h-5 rounded shrink-0"
                  style={{ backgroundColor: item.color, outline: `1px solid ${hexToRgba(item.color, 0.9)}` }}
                  aria-label={item.description}
                />
                <span className="text-gray-700 leading-snug break-words">{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LookingInMap;


