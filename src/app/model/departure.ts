import { Destination } from "./destination";
import { PickUp } from "./pickup";

export class Departure {
  id!: string;
  name?: string;
  slug?: string;
  destinations?: Destination[];
  pickUps?: PickUp[];
}
