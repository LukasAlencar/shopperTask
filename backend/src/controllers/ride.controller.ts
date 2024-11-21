import { Request, Response } from 'express';
import axios from 'axios';

const drivers = [
    {
      id: 1,
      name: "Homer Simpson",
      description: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
      car: "Plymouth Valiant 1973 rosa e enferrujado",
      rate: 2,
      coments: "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
      taxPerKm: 2.5,
      minKm: 1
    },
    {
      id: 2,
      name: "Dominic Toretto",
      description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
      car: "Dodge Charger R/T 1970 modificado",
      rate: 4,
      coments: "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
      taxPerKm: 5.0,
      minKm: 5
    },
    {
      id: 3,
      name: "James Bond",
      description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
      car: "Aston Martin DB5 clássico",
      rate: 5,
      coments: "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
      taxPerKm: 10.0,
      minKm: 10
    }
  ];
  

export const estimateRide = async (req: Request, res: Response) => {

  const origin = { latitude: -23.4259933, longitude: -46.5082575 } // Origem: Casa
  const destination = { latitude: -23.4296051, longitude: -46.5044748 }  // Destino: Igreja
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log(apiKey)
  try {
    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        'origin': {
          'location': {
            'latLng': {
              'latitude': origin.latitude,
              'longitude': origin.longitude
            }
          }
        },
        'destination': {
          'location': {
            'latLng': {
              'latitude': destination.latitude,
              'longitude': destination.longitude
            }
          }
        },
        'travelMode': 'DRIVE',
        'routingPreference': 'TRAFFIC_AWARE',
        'computeAlternativeRoutes': false,
        'routeModifiers': {
          'avoidTolls': false,
          'avoidHighways': false,
          'avoidFerries': false
        },
        'languageCode': 'en-US',
        'units': 'IMPERIAL'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AIzaSyBfXDRdUC9lxBxHFbFW_D2bumjG39zlcQc',
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        }
      }
    );

    const route = response.data.routes[0];
    const distanceKm = route.distanceMeters / 1000;
    const driversWithValues = drivers
      .filter(driver => driver.minKm < distanceKm)
      .map(driver => ({
        ...driver,
        price: distanceKm * driver.taxPerKm
    }));
    console.log(driversWithValues)

  } catch (error: any) {
    console.error("Erro ao calcular a rota:", error.response?.data.error.details || error.message.error.details);
  }
  
    res.status(200).json(drivers);
}