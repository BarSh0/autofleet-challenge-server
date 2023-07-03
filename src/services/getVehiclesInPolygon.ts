import { Point, Vehicle } from '../constants/intefaces';

const pointInPolygon = (point: Point, polygon: Point[]): boolean => {
  if (!point || !polygon) return false;
  const x = point.lng;
  const y = point.lat;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
};

const getVehiclesInPolygon = (polygon: Point[], vehicles: Vehicle[]): Vehicle[] => {
  const vehiclesInPolygon = vehicles.filter((vehicle) => {
    const { location } = vehicle;
    return pointInPolygon(location, polygon);
  });
  return vehiclesInPolygon;
};

export default getVehiclesInPolygon;
