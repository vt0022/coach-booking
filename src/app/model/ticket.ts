import { DropOff } from "./dropoff";
import { Line } from "./line";
import { LineSeat } from "./lineseat";
import { Passenger } from "./passenger";
import { PickUp } from "./pickup";

export class Ticket {
  id?: string;

  _oneway?: boolean;

  number?: number;

  note?: string;

  street_number?: string;

  cost?: number;

  _paid?: boolean;

  pickUp?: PickUp;

  dropOff?: DropOff;

  passengers?: Passenger[] = [];

  line?: Line;

  lineSeats?: LineSeat[] = [];
}
