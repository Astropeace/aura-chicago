"use client";

import { useState } from 'react';
import Map, { Marker, NavigationControl, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EventData } from '@/data/mockEvents';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  events: EventData[];
  onEventSelect: (event: EventData | null) => void;
}

// Mapbox token - set via environment variable for security
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiYXN0cm9wZWFjZSIsImEiOiJjbXUwNXJ2MXgwNzl4MnlwdXlsYmR4OHl4In0.Gfv2-8O8VCbpgRA3fWdkAA";

// 3D Transparent Wireframe/Glass Buildings Layer
const buildingLayer: any = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 14,
  paint: {
    // Transparent neon cyan for that holographic wiremap feel
    'fill-extrusion-color': 'rgba(34, 211, 238, 0.05)', 
    'fill-extrusion-height': [
      'interpolate', ['linear'], ['zoom'],
      14, 0,
      14.05, ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate', ['linear'], ['zoom'],
      14, 0,
      14.05, ['get', 'min_height']
    ],
    // Opacity creates the overlapping glass/wireframe effect
    'fill-extrusion-opacity': 1.0, 
  }
};

export default function MapComponent({ events, onEventSelect }: MapComponentProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative border-r border-cyan-900/50">
      <Map
        initialViewState={{
          longitude: -87.6298,
          latitude: 41.8781,
          zoom: 15.5, // Zoomed in tight to see the 3D buildings
          pitch: 65, // Aggressive pitch for 3D feel
          bearing: -17.6,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        
        {/* Render 3D Buildings */}
        <Layer {...buildingLayer} />
        
        {events.map((event, index) => {
          const auraColor = 
            event.source === 'Ticketmaster' ? '#b026ff' :
            event.source === 'Posh' ? '#ff2a85' :
            event.source === 'PR' ? '#22d3ee' :
            event.source === 'Tech' ? '#39ff14' : '#ffffff';

          return (
            <Marker
              key={`${event.id}-${index}`}
              longitude={event.longitude}
              latitude={event.latitude}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedEventId(event.id);
                onEventSelect(event);
              }}
            >
              <div className={`cursor-pointer transition-transform duration-300 ${selectedEventId === event.id ? 'scale-125' : 'hover:scale-110'}`}>
                <div className="relative flex items-center justify-center w-10 h-10">
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: auraColor }}
                  ></div>
                  <div 
                    className="relative bg-black border-2 p-2 rounded-full"
                    style={{ 
                      borderColor: auraColor, 
                      color: auraColor,
                      boxShadow: `0 0 15px ${auraColor}80` // 80 is 50% opacity hex
                    }}
                  >
                    <MapPin size={16} />
                  </div>
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* Cyberpunk Overlay Gradient for atmosphere */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
    </div>
  );
}
