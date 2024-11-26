import React, { useEffect } from 'react';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteResponse } from '@/types/api.estimate.response';

type MapComponentProps = {
    routeData?: RouteResponse;
};

function decodePolyline(encoded: string): LatLngTuple[] {
    let index = 0, lat = 0, lng = 0, coordinates = [];
    const factor = 1e5;

    while (index < encoded.length) {
        let shift = 0, result = 0, b;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coordinates.push([lat / factor, lng / factor]);
    }
    return coordinates as LatLngTuple[];
}

const MapComponent = ({ routeData }: MapComponentProps) => {
    useEffect(() => {
        const defaultCoords: LatLngTuple = [-23.561684, -46.656139];

        const initialCoords: LatLngTuple = routeData
            ? [routeData.origin.latitude, routeData.origin.longitude]
            : defaultCoords;

        const map = L.map('map').setView(initialCoords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        !routeData && L.marker(defaultCoords).addTo(map).bindPopup('Ponto Padrão: Avenida Paulista');

        if (routeData) {
            L.marker([routeData.origin.latitude, routeData.origin.longitude])
                .addTo(map)
                .bindPopup('Origem');
            L.marker([routeData.destination.latitude, routeData.destination.longitude])
                .addTo(map)
                .bindPopup('Destino');

            const polylineCoordinates: LatLngTuple[] = routeData.routeResponse.legs[0].steps.flatMap(
                (step: any) => decodePolyline(step.polyline.encodedPolyline)
            );

            L.polyline(polylineCoordinates, { color: 'blue' }).addTo(map);
        }

        // Cleanup: destruir mapa
        return () => {
            map.remove();
        };
    }, [routeData]);

    return <div id="map" className="w-full h-full" />;
};

export default MapComponent;
