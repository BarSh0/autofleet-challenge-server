import { Request, Response, Router } from 'express';
import * as Vehicles from '../../vehicles-location.json';
import getVehiclesInPolygon from '../services/getVehiclesInPolygon';
import logger from '../utils/logger';
import { Point } from '../constants/intefaces';

const router = Router();

const vehicles = Object.values(Vehicles);

router.get('/', (req: Request, res: Response) => {
  try {
    res.send(vehicles);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/by-polygon', (req: Request, res: Response) => {
  try {
    const { polygons } = req.body;
    if (!polygons) throw new Error('Polygon is required');
    logger.info(`Searching for vehicles with ${polygons.length} polygons`);

    let vehiclesInPolygon: any[] = [];

    polygons.forEach((polygon: Point[]) => {
      if (!polygon) throw new Error('Polygon is required');
      if (!polygon.length) throw new Error('Polygon must have at least one point');
      vehiclesInPolygon = [...vehiclesInPolygon, ...getVehiclesInPolygon(polygon, vehicles)];
      vehiclesInPolygon = vehiclesInPolygon.filter(
        (vehicle, index, self) => index === self.findIndex((t) => t.id === vehicle.id)
      );
    });
    logger.info(`Found ${vehiclesInPolygon.length} vehicles in polygons`);
    res.send(vehiclesInPolygon);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ error: 'Internal server error', message: error.message });
  }
});

export default router;
