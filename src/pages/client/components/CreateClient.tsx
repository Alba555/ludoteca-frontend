import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Client } from "../../../types/Client";

interface Props {
  client: Client | null;
  closeModal: () => void;
  create: (name: string) => void;
}

export default function CreateClient(props: Props) {

  const [name, setName] = useState(props?.client?.name || "");

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>

        <DialogTitle>
          {props.client ? "Actualizar Cliente" : "Crear Cliente"}
        </DialogTitle>

        <DialogContent>

          {props.client && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.client.id}
              variant="standard"
            />
          )}

          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={props.closeModal}>
            Cancelar
          </Button>

          <Button
            onClick={() => props.create(name)}
            disabled={!name}
          >
            {props.client ? "Actualizar" : "Crear"}
          </Button>

        </DialogActions>

      </Dialog>
    </div>
  );
}