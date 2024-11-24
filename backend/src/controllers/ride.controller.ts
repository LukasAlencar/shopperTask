import { Request, RequestHandler, Response } from 'express';
import axios from 'axios';
import { drivers } from '../utils/drives';
import RideMade from '../models/RideMade';
import { RideMadeAttributes } from '../types/RideMade';

export const estimateRide: RequestHandler = async (req, res) => {

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
    res.status(400).json({statusCode: "400", description: "Os dados fornecidos no corpo da requisição são inválidos", response: {error_code: "INVALID_DATA", error_description: error.message || error.response.data} });
    return;
  }
}

export const confirmRide: RequestHandler = async (req, res) => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  if (isEmpty(destination) || isEmpty(origin) || isEmpty(customer_id) || destination == origin){
    res.status(400).json({statusCode: "400", description: "Os dados fornecidos no corpo da requisição são inválidos", response: {error_code: "INVALID_DATA", error_description: 'error.message'}});
    return;
  }

  let validDriver = findDriverById(driver.id);

  if (!validDriver){
    res.status(404).json({statusCode: "404", description: "Motorista não encontrado", response: {error_code: "DRIVER_NOT_FOUND", error_description: 'error.message'}});
    return;
  }else{
    if(distance < validDriver.minKm * 1000){
      res.status(406).json({statusCode: "406", description: "Quilometragem inválida para o motorista", response: {error_code: "INVALID_DISTANCE", error_description: 'error.message'}});
      return;
    }
  }
  
  try {
    const rideData:RideMadeAttributes = 
    {
      customer_id,
      origin, 
      destination, 
      distance, 
      duration,
      driver_id: driver.id, 
      driver_name: driver.name, 
      value,
    };

    await RideMade.create(rideData);
    res.status(200).json({statusCode: 200, description:'Operação realizada com sucesso', response:{success: true}});
    return;
  }catch (error: any) {
    res.status(400).json({statusCode: "400", description: "Os dados fornecidos no corpo da requisição são inválidos", response: {error_code: "INVALID_DATA", error_description: error.message || error.response.data} });
    return;
  }
}

export const getRideByCustomerAndDriverIDs: RequestHandler = async (req, res) => {
  const customerId = req.params.customerId;
  const driverId = req.query.driver_id;
  if (isEmpty(customerId) || customerId.indexOf('driver_id') > -1){
    res.status(404).json({statusCode: "404", description: "Nenhum registro encontrado", response: {error_code: "NO_RIDES_FOUND", error_description: 'Usuário não informado'}});
    return;
  }
  if(driverId === undefined || driverId === null || driverId === ''){
    res.status(404).json({statusCode: "404", description: "Nenhum registro encontrado", response: {error_code: "NO_RIDES_FOUND", error_description: 'Motorista não informado'}});
    return
  }

  let validDriver = findDriverById(Number(driverId));
  if (!validDriver){
    res.status(404).json({statusCode: "404", description: "Motorista inválido", response: {error_code: "INVALID_DRIVER", error_description: 'Id do motorista inválido'}});
    return;
  }

  try {
    const ride = await RideMade.findAll({ where: { customer_id: customerId, driver_id: Number(driverId) } });
    if (!ride) {
      res.status(404).json({statusCode: "404", description: "Nenhum registro encontrado", response: {error_code: "NO_RIDES_FOUND", error_description: 'Nenhum registro encontrado'}});
      return;
    }
    res.status(200).json({statusCode: 200, description:'Operação realizada com sucesso', response: ride});
    return;
  }catch (error: any) {
    res.status(404).json({statusCode: "404", description: "Nenhum registro encontrado", response: {error_code: "NO_RIDES_FOUND", error_description: error.message || error.response.data }});
    return;
  }
}

const findDriverById = (id: number) => {
  const driver = drivers.find((driver) => driver.id === id);
  return driver ? driver : null; 
};

const isEmpty = (str: string) => {
  return str === undefined || str === null || str.trim() === '';
}