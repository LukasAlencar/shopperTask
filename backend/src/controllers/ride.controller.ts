import { Request, RequestHandler, Response } from 'express';
import axios from 'axios';
import { drivers } from '../utils/drives';

export const estimateRide = async (req: Request, res: Response) => {

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Chave da API não configurada." });
    return;
  }

  try {
    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: { address: req.body.origin },
        destination: { address: req.body.destination },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "IMPERIAL",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.legs.steps",
        },
      }
    );

    const route = response.data.routes[0];
    const distanceKm = route.distanceMeters / 1000;
    const driversWithValues = drivers
      .filter((driver) => driver.minKm < distanceKm)
      .map((driver) => ({
        ...driver,
        price: Math.floor((distanceKm * driver.taxPerKm) * 100) / 100,
      }));

    const startLocation = route.legs[0].steps[0]?.startLocation;
    const endLocation = route.legs[0].steps[route.legs[0].steps.length - 1]?.endLocation;
    
    res.status(200).json({statusCode: "200", description: "Operação realizada com sucesso", response: {origin: startLocation.latLng, destination: endLocation.latLng, distance: route.distanceMeters, duration: route.duration, options: driversWithValues, routeResponse: response.data.routes[0]} });
  } catch (error: any) {
    console.error(
      "Erro ao calcular a rota:",
      error.response?.data || error.message
    );
    res.status(400).json({statusCode: "400", description: "Os dados fornecidos no corpo da requisição são inválidos", response: {error_code: "INVALID_DATA", error_description: error.message || error.response.data} });
    return;
  }
  
}