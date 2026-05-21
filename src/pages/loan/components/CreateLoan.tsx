import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
    startDate: null as Date | null,
    endDate: null as Date | null,
  });


  useEffect(() => {
    if (loan) {
      setForm({
        gameId: loan.game.id,
        clientId: loan.client.id,
        startDate: loan.startDate ? new Date(loan.startDate) : null,
        endDate: loan.endDate ? new Date(loan.endDate) : null,
      });
    }
  }, [loan]);


  const save = () => {

    if (!form.startDate || !form.endDate) {
      return;
    }

    const start = form.startDate;
    const end = form.endDate;

 
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
            setMessage({
              text: error.message,
              type: "error",
            })
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
    <Dialog
      open={true}
      onClose={closeModal}

    
      PaperProps={{
        sx: {
          width: "560px",
          maxWidth: "560px",
          minHeight: "520px",
          borderRadius: "16px",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.18)",
          padding: "8px 4px",
        },
      }}
    >

      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.4rem",
          paddingBottom: "10px",
        }}
      >
        {loan ? "Actualizar préstamo" : "Crear préstamo"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: "8px !important",
        }}
      >

  
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

     
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 260,
                },
              },
            },
          }}
          sx={{
            minWidth: "100%",
          }}
        >
          {games?.map((g) => (
            <MenuItem
              key={g.id}
              value={g.id}
              sx={{
                maxWidth: "500px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
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
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 260,
                },
              },
            },
          }}
          sx={{
            minWidth: "100%",
          }}
        >
          {clients?.map((c) => (
            <MenuItem
              key={c.id}
              value={c.id}
              sx={{
                maxWidth: "500px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.name}
            </MenuItem>
          ))}
        </TextField>

   
        <DatePicker
          label="Fecha inicio"
          value={form.startDate}
          onChange={(newValue) => setForm({ ...form, startDate: newValue })}
          format="dd/MM/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "standard",
              margin: "dense",
            },
          }}
        />


        <DatePicker
          label="Fecha fin"
          value={form.endDate}
          onChange={(newValue) => setForm({ ...form, endDate: newValue })}
          format="dd/MM/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "standard",
              margin: "dense",
            },
          }}
        />

      </DialogContent>

      <DialogActions
        sx={{
          padding: "20px 24px 16px 24px",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button onClick={closeModal}>Cancelar</Button>

        <Button
          variant="contained"
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