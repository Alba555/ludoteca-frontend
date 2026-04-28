import { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./Loan.module.css";

import {
  useGetGamesQuery,
  useGetClientsQuery,
} from "../../redux/services/ludotecaApi";

import CreateLoan from "./components/CreateLoan";
import { ConfirmDialog } from "../../components/ConfirmDialog";

import type { Loan as LoanModel } from "../../types/Loan";

export const Loan = () => {

  const { data: games } = useGetGamesQuery({ title: "", idCategory: "" });
  const { data: clients } = useGetClientsQuery(null);

  const [loans, setLoans] = useState<LoanModel[]>([]);

  const [gameFilter, setGameFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);


  const [openCreate, setOpenCreate] = useState(false);
  const [loanToUpdate, setLoanToUpdate] = useState<LoanModel | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  
  const fetchLoans = () => {
    fetch("http://localhost:8080/loan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: gameFilter || null,
        clientId: clientFilter || null,
        date: dateFilter ? new Date(dateFilter).toISOString() : null,
        pageable: {
          pageNumber: page,
          pageSize: rowsPerPage,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoans(data.content);
        setTotalElements(data.totalElements);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, [page, rowsPerPage]);

 
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES");
  };

  
  const deleteLoan = () => {
    fetch(`http://localhost:8080/loan/${idToDelete}`, {
      method: "DELETE",
    }).then(() => {
      setIdToDelete(null);
      fetchLoans();
    });
  };

  return (
    <div className="container">

      <h1>Gestión de préstamos</h1>

      
      <div className={styles.filter}>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            select
            label="Juego"
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
          >
            {games?.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.title}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            select
            label="Cliente"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            {clients?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>

        
        <div style={{ display: "flex", gap: "15px", marginLeft: "10px" }}>
          <Button
            variant="outlined"
            onClick={() => {
              setGameFilter("");
              setClientFilter("");
              setDateFilter("");
              setPage(0);
              fetchLoans();
            }}
          >
            Limpiar
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setPage(0);
              fetchLoans();
            }}
          >
            Filtrar
          </Button>
        </div>

      </div>

      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }}>

          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre del juego</TableCell>
              <TableCell>Nombre del cliente</TableCell>
              <TableCell>Fecha inicio</TableCell>
              <TableCell>Fecha fin</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.game.title}</TableCell>
                <TableCell>{loan.client.name}</TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
                <TableCell>{formatDate(loan.endDate)}</TableCell>

                <TableCell align="right">
                  <div className={styles.tableActions}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setLoanToUpdate(loan);
                        setOpenCreate(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => setIdToDelete(loan.id)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={6}
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </TableRow>
          </TableFooter>

        </Table>
      </TableContainer>

     
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo préstamo
        </Button>
      </div>

      
      {openCreate && (
        <CreateLoan
          loan={loanToUpdate}
          refresh={fetchLoans}
          closeModal={() => {
            setLoanToUpdate(null);
            setOpenCreate(false);
          }}
        />
      )}

      
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar préstamo"
          text="¿Seguro que quieres eliminar?"
          confirm={deleteLoan}
          closeModal={() => setIdToDelete(null)}
        />
      )}

    </div>
  );
};
