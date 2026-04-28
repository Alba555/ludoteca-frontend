import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Author } from "../../../types/Author";
import type { ChangeEvent } from "react";

interface Props {
  author: Author | null;
  closeModal: () => void;
  create: (author: Author) => void;
}

const initialState = {
  name: "",
  nationality: "",
};

export default function CreateAuthor(props: Props) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(props?.author || initialState);
  }, [props?.author]);

  const handleChangeForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {props.author ? "Actualizar Autor" : "Crear Autor"}
        </DialogTitle>
        <DialogContent>
          {props.author && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.author.id}
              variant="standard"
            />
          )}
          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.name}
          />
          <TextField
            margin="dense"
            id="nationality"
            label="Nacionalidad"
            fullWidth
            variant="standard"
            onChange={handleChangeForm}
            value={form.nationality}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button
            onClick={() =>
              props.create({
                id: props.author ? props.author.id : "",
                name: form.name,
                nationality: form.nationality,
              })
            }
            disabled={!form.name || !form.nationality}
          >
            {props.author ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
