import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Category } from "../../../types/Category";

interface Props {
  category: Category | null;
  closeModal: () => void;
  create: (name: string) => void;
}

export default function CreateCategory(props: Props) {
  const [name, setName] = useState(props?.category?.name || "");


  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {props.category ? "Actualizar Categoría" : "Crear Categoría"}
        </DialogTitle>
        <DialogContent>
          {props.category && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.category.id}
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
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button onClick={() => props.create(name)} disabled={!name}>
            {props.category ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
