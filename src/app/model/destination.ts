import { DropOff } from './dropoff';

export class Destination {
  id!: string;
  name?: string;
  slug?: string;
  dropOffs?: DropOff[];
}
