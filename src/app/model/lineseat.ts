import { LineSeatKey } from './lineseatkey';
import { Seat } from './seat';

export class LineSeat {
  lineSeatKey!: LineSeatKey;
  _available?: boolean;
  seat?: Seat;
}
