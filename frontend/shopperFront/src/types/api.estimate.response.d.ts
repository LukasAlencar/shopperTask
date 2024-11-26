type LatLng = {
    latitude: number;
    longitude: number;
};

type DriverOption = {
    id: number;
    name: string;
    description: string;
    car: string;
    rate: number;
    coments: string;
    taxPerKm: number;
    minKm: number;
    price: number;
};

type RouteDetails = {
    legs: Leg[];
    distanceMeters: number;
    duration: string;
};

type Leg = {
    steps: Step[];
};

type Step = {
    distanceMeters: number;
    staticDuration: string;
    polyline: { encodedPolyline: string };
    startLocation: { latLng: LatLng };
    endLocation: { latLng: LatLng };
    navigationInstruction: NavigationInstruction;
    localizedValues: LocalizedValues;
    travelMode: string;
};

type NavigationInstruction = {
    maneuver: string;
    instructions: string;
};

type LocalizedValues = {
    distance: { text: string };
    staticDuration: { text: string };
};

export type RouteResponse = {
    origin: LatLng;
    destination: LatLng;
    distance: number;
    duration: string;
    options: DriverOption[];
    routeResponse: RouteDetails;
};

export type ApiResponse = {
    statusCode: string;
    description: string;
    response: RouteResponse;
};
  