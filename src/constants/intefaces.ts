export interface Point {
  lat: number;
  lng: number;
  bearing?: number;
}

export interface Vehicle {
  id: string;
  state: string;
  routeCommitId: string | null;
  seats: number;
  class: { name: string };
  location: Point;
  distance: number;
}
