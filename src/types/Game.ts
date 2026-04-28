import { type Category } from "./Category";
import { type Author } from "./Author";

export interface Game {
  id: number;
  title: string;
  age: string;
  category?: Category;
  author?: Author;
}
