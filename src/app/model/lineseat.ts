import { CompositeKey } from './compositekey';
import { Seat } from './seat';

export class LineSeat {
  compositeKey!: CompositeKey;
  _available?: boolean;
  seat?: Seat;
}
