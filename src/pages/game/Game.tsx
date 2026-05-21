import { useState, useContext, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GameCard from "./components/GameCard";
import styles from "./Game.module.css";
import {
  useCreateGameMutation,
  useGetCategoriesQuery,
  useGetGamesQuery,
  useUpdateGameMutation,
} from "../../redux/services/ludotecaApi";
import CreateGame from "./components/CreateGame";
import { LoaderContext } from "../../context/LoaderProvider";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";
import type { Game as GameModel } from "../../types/Game";
import type { Category } from "../../types/Category";

export const Game = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [gameToUpdate, setGameToUpdate] = useState<GameModel | null>(null);
  const loader = useContext(LoaderContext);
  const dispatch = useAppDispatch();

  const { data, error, isLoading, isFetching } = useGetGamesQuery({
    title: filterTitle,
    idCategory: filterCategory,
  });

  const [updateGameApi, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateGameMutation();

  const { data: categories } = useGetCategoriesQuery(null);

  const [createGameApi, { isLoading: isLoadingCreate, error: errorCreate }] =
    useCreateGameMutation();

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoadingUpdate || isLoading || isFetching
    );
  }, [isLoadingCreate, isLoadingUpdate, isLoading, isFetching]);

  useEffect(() => {
    if (errorCreate || errorUpdate) {
      setMessage({
        text: "Se ha producido un error al realizar la operación",
        type: "error",
      });
    }
  }, [errorUpdate, errorCreate]);

  if (error) return <p>Error cargando!!!</p>;

  const createGame = (game: GameModel) => {
    setOpenCreate(false);
    if (gameToUpdate) {
      updateGameApi({
        ...game,
        id: gameToUpdate.id,
      })
        .then(() => {
          dispatch(
            setMessage({
              text: "Juego actualizado correctamente",
              type: "ok",
            })
          );
          setGameToUpdate(null);
        })
        .catch((err) => console.log(err));
    } else {
      createGameApi(game)
        .then(() => {
          dispatch(
            setMessage({
              text: "Juego creado correctamente",
              type: "ok",
            })
          );
          setGameToUpdate(null);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container">
      <h1>Catálogo de juegos</h1>
      <div className={styles.filter}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            margin="dense"
            id="title"
            label="Titulo"
            fullWidth
            value={filterTitle}
            variant="standard"
            onChange={(event) => setFilterTitle(event.target.value)}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id="category"
            select
            label="Categoría"
            defaultValue="''"
            fullWidth
            variant="standard"
            name="author"
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
          >
            {categories &&
              categories.map((option: Category) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => {
            setFilterCategory("");
            setFilterTitle("");
          }}
        >
          Limpiar
        </Button>
      </div>
      <div className={styles.cards}>
        {data?.map((card) => (
          <div
            key={card.id}
            className={styles.card}
            onClick={() => {
              setGameToUpdate(card);
              setOpenCreate(true);
            }}
          >
            <GameCard game={card} />
          </div>
        ))}
      </div>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo juego
        </Button>
      </div>
      {openCreate && (
        <CreateGame
          create={createGame}
          game={gameToUpdate}
          closeModal={() => {
            setGameToUpdate(null);
            setOpenCreate(false);
          }}
        />
      )}
    </div>
  );
};