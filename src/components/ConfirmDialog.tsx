import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  closeModal: () => void;
  confirm: () => void;
  title: string;
  text: string;
}

export const ConfirmDialog = (props: Props) => {
  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button onClick={() => props.confirm()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
