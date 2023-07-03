import { Request, Response, Router } from 'express';
import * as Vehicles from '../../vehicles-location.json';
import getVehiclesInPolygon from '../services/getVehiclesInPolygon';
import logger from '../utils/logger';

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
    const { polygon } = req.body;
    if (!polygon) throw new Error('Polygon is required');
    logger.info(`Searching for vehicles in polygon with ${polygon.length} points`);
    const vehiclesInPolygon = getVehiclesInPolygon(polygon, vehicles);
    logger.info(`Found ${vehiclesInPolygon.length} vehicles in polygon`);
    res.send(vehiclesInPolygon);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ error: 'Internal server error', message: error.message });
  }
});

export default router;
