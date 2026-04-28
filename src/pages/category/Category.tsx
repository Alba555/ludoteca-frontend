import { useState, useEffect, useContext  } from "react";
import { LoaderContext } from "../../context/LoaderProvider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import styles from "./Category.module.css";
import type { Category as CategoryModel } from "../../types/Category";
import CreateCategory from "./components/CreateCategory";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/services/ludotecaApi";
import { setMessage } from "../../redux/features/messageSlice";
import type { BackError } from "../../types/appTypes";





export const Category = () => {

  const [openCreate, setOpenCreate] = useState(false);

  const [categoryToUpdate, setCategoryToUpdate] = useState<CategoryModel | null>(null);

  const [idToDelete, setIdToDelete] = useState("");

  const loader = useContext(LoaderContext);

  



  const createCategory = (category: string) => {
    setOpenCreate(false);
    if (categoryToUpdate) {
      updateCategoryApi({ id: categoryToUpdate.id, name: category })
        .then(() => {
          dispatch(
            setMessage({
              text: "Categoría actualizada correctamente",
              type: "ok",
            })
          );
          setCategoryToUpdate(null);
        })
        .catch((err) => console.log(err));
    } else {
      createCategoryApi({ name: category })
        .then(() => {
          dispatch(
            setMessage({ text: "Categoría creada correctamente", type: "ok" })
          );
          setCategoryToUpdate(null);
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteCategory = () => {
    deleteCategoryApi(idToDelete)
      .then(() => {
        dispatch(
          setMessage({
            text: "Categoría borrada correctamente",
            type: "ok",
          })
        );
        setIdToDelete("");
      })
      .catch((err) => console.log(err));
  };


  const handleCloseCreate = () => {
    setOpenCreate(false);
    setCategoryToUpdate(null);
  };


  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetCategoriesQuery(null);

  const [ deleteCategoryApi, { isLoading: isLoadingDelete, error: errorDelete },] = useDeleteCategoryMutation();
  
  const [createCategoryApi, { isLoading: isLoadingCreate }] = useCreateCategoryMutation();

  const [updateCategoryApi, { isLoading: isLoadingUpdate }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (errorDelete) {
      if ("status" in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: "error",
          })
        );
      }
    }
  }, [errorDelete, dispatch]);


  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
    }
  }, [error]);
  

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
    );
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate]);




  return (
    <div className="container">
      <h1>Listado de Categorías</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre categoría</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((category: CategoryModel) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>
                  <div className={styles.tableActions}>
                      <IconButton
                      aria-label="update"
                      color="primary"
                      onClick={() => {
                        setCategoryToUpdate(category);
                        setOpenCreate(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                                          <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setIdToDelete(category.id);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
            <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nueva categoría
        </Button>
      </div>

      {openCreate && (
        <CreateCategory
          create={createCategory}
          category={categoryToUpdate}
          closeModal={handleCloseCreate}
        />
      )}

      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar categoría"
          text="Atención si borra la categoría se perderán sus datos. ¿Desea eliminar la categoría?"
          confirm={deleteCategory}
          closeModal={() => setIdToDelete('')}
        />
      )}


    </div>
  );
};
