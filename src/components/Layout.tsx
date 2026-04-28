import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CasinoIcon from "@mui/icons-material/Casino";
import { useNavigate, Outlet } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteMessage } from "../redux/features/messageSlice";

const pages = [
  { name: "Catalogo", link: "games" },
  { name: "Categorías", link: "categories" },
  { name: "Autores", link: "authors" },
  { name: "Clientes", link: "clients" },
  { name: "Préstamos", link: "loans" }
];

export const Layout = () => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { text, type } = useAppSelector((state) => state.messageReducer);

  useEffect(() => {

    setTimeout(() => {
      dispatch(deleteMessage());
    }, 3000);

  }, [text, type]);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (link: string) => {

    navigate(`/${link}`);
    setAnchorElNav(null);

  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            <CasinoIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Ludoteca Tan
            </Typography>

            

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >

                {pages.map((page) => (

                  <MenuItem
                    key={page.name}
                    onClick={() => handleCloseNavMenu(page.link)}
                  >
                    <Typography textAlign="center">
                      {page.name}
                    </Typography>
                  </MenuItem>

                ))}

              </Menu>

            </Box>

            <CasinoIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Ludoteca Tan
            </Typography>

            

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>

              {pages.map((page) => (

                <Button
                  key={page.name}
                  onClick={() => handleCloseNavMenu(page.link)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>

              ))}

            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {text && (
        <Alert severity={type === "error" ? "error" : "success"}>
          {text}
        </Alert>
      )}

      <Outlet />

    </>
  );
};