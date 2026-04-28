import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";

import {
  useGetGamesQuery,
  useGetClientsQuery,
} from "../../../redux/services/ludotecaApi";

import { useAppDispatch } from "../../../redux/hooks";
import { setMessage } from "../../../redux/features/messageSlice";

export default function CreateLoan({ loan, closeModal, refresh }: any) {

  const dispatch = useAppDispatch();

  const { data: games } = useGetGamesQuery({ title: "", idCategory: "" });
  const { data: clients } = useGetClientsQuery(null);

  const [form, setForm] = useState({
    gameId: "",
    clientId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (loan) {
      setForm({
        gameId: loan.game.id,
        clientId: loan.client.id,
        startDate: loan.startDate?.substring(0, 10),
        endDate: loan.endDate?.substring(0, 10),
      });
    }
  }, [loan]);

  const save = () => {

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    // ================= VALIDACIÓN FRONT =================

    if (end < start) {
      dispatch(
        setMessage({
          text: "La fecha fin no puede ser anterior a la de inicio",
          type: "error",
        })
      );
      return;
    }

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    if (diff > 14) {
      dispatch(
        setMessage({
          text: "El préstamo no puede superar 14 días",
          type: "error",
        })
      );
      return;
    }

    // ================= BACK ================

    fetch(`http://localhost:8080/loan${loan ? "/" + loan.id : ""}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: { id: form.gameId },
        client: { id: form.clientId },
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      }),
    })
      .then(async (res) => {

        if (!res.ok) {

        const error = await res.json();

        dispatch(
          setMessage(
            {
              text: error.message,
              type: "error",
            }
          )
        );

          return;
        }

        dispatch(
          setMessage({
            text: loan
              ? "Préstamo actualizado correctamente"
              : "Préstamo creado correctamente",
            type: "ok",
          })
        );

        refresh();
        closeModal();
      })
      .catch(() => {
        dispatch(
          setMessage({
            text: "Error de conexión con el servidor",
            type: "error",
          })
        );
      });
  };

  return (
    <Dialog open={true} onClose={closeModal}>

      <DialogTitle>
        {loan ? "Actualizar préstamo" : "Crear préstamo"}
      </DialogTitle>

      <DialogContent>

        {loan && (
          <TextField
            margin="dense"
            disabled
            label="Id"
            fullWidth
            value={loan.id}
            variant="standard"
          />
        )}

        <TextField
          select
          label="Juego"
          fullWidth
          variant="standard"
          value={form.gameId}
          onChange={(e) => setForm({ ...form, gameId: e.target.value })}
        >
          {games?.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Cliente"
          fullWidth
          variant="standard"
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
        >
          {clients?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          fullWidth
          variant="standard"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <TextField
          type="date"
          fullWidth
          variant="standard"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={closeModal}>Cancelar</Button>
        <Button
          onClick={save}
          disabled={
            !form.gameId ||
            !form.clientId ||
            !form.startDate ||
            !form.endDate
          }
        >
          {loan ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>

    </Dialog>
  );
}