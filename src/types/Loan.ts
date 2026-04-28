import { type Game } from "./Game";
import { type Client } from "./Client";

export interface Loan {
  id: number;
  game: Game;
  client: Client;
  startDate: string;
  endDate: string;
}
