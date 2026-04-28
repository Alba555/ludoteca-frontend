import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import CardActionArea from "@mui/material/CardActionArea";
import { red } from "@mui/material/colors";
import imageGame from "./../../../assets/foto.png";
import type { Game } from "../../../types/Game";

interface GameCardProps {
  game: Game;
}

export default function GameCard(props: GameCardProps) {
  const { title, age, category, author } = props.game;
  return (
    <Card sx={{ maxWidth: 265 }}>
      <CardHeader
        sx={{
          ".MuiCardHeader-title": {
            fontSize: "20px",
          },
        }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="age">
            +{age}
          </Avatar>
        }
        title={title}
        subheader={category?.name}
      />
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imageGame}
          alt="game image"
        />
        <CardContent>
          <List dense={true}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`Autor: ${author?.name}`} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LanguageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`Nacionalidad: ${author?.nationality}`} />
            </ListItem>
          </List>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
