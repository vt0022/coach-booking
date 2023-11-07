import { LineSeat } from "./lineseat";

export class Line {
  id!: string;
  departureTime?: string;
  departureDate?: Date;
  price?: number;
  status?: boolean;
  lineSeats?: LineSeat[];
}
