import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
// import IconButton from '@material-ui/core/IconButton';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import CreateIcon from '@material-ui/icons/Create';
// import DeleteIcon from '@material-ui/icons/Delete';
// import PersonIcon from '@material-ui/icons/Person';
// import AccountCircle from '@material-ui/icons/AccountCircle';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';

// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';

// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

import { deepOrange, deepPurple } from '@material-ui/core/colors';

import { Scrollbars } from 'react-custom-scrollbars';

// import toastr from 'toastr'
// import 'toastr/build/toastr.min.css'

import albumService from "../../services/albums";

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const classNames = require("classnames");
const moment = require("moment");

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
    cardGrid: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(8),
    },
    gridContent: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 250,
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
}));


function getTimeDiff(dateCreated){
  let now = moment(Date.now());
  let last = moment(dateCreated);
  let minutes = now.diff(last, 'minutes'),
      hours = now.diff(last, 'hours'),
      days = now.diff(last, 'days'),
      weeks = now.diff(last, 'weeks'),
      months = now.diff(last, 'months'),
      years = now.diff(last, 'years');
  if(years>0){
    if((months-years*12)>0)
      return years+" ans et "+(months-years*12)+" mois";
    else
      return years+" ans";
  }
  if(months>0){
    if((days-months*30)>0)
      return months+" mois et "+(days-months*30)+" jours";
    else
      return months+" mois";
  }
  if(weeks>0){
    if((days-weeks*7)>0)
      return weeks+" semaines et "+(days-weeks*7)+" jours";
    else
      return weeks+" semaines";
  }
  if(days>0){
    if((hours-days*24)>0)
      return days+" jours et "+(hours-days*24)+" heures";
    else
      return days+" jours";
  }
  if(hours>0){
    if((minutes-hours*60)>0)
      return hours+" heures et "+(minutes-hours*60)+" minutes";
    else
      return hours+" heures"
  }
  if(minutes>0)
    return minutes+" minutes";
}



export default function (props) {
  const classes = useStyles();

  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [albums, setAlbums] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
    if(search !== ""){
      albumService.find(event.target.value).then(rep =>{
        setAlbums(rep.data);
      }, err => {
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      });
    };
  }


  return (
    <Container className={classes.cardGrid} maxWidth={false}>
      <Card>
        <CardContent>
          <TextField
                    variant="outlined"
                    required
                    fullWidth
                    autoFocus
                    id="email"
                    label="Rechercher un album"
                    value={search}
                    onInput={handleSearch}
                    name="email"
                    autoComplete="Email, nom, prenom"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><SearchIcon color="textSecondary" /></InputAdornment>)
                    }}
                />
                <Typography variant="body2" color="textSecondary" align="right" style={{paddingTop:6}}>{albums.length>0 ? albums.length : "Aucuns"} albums trouvés</Typography>
              </CardContent>
        </Card>
      {loading ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
        ) : (
          <Grid container spacing={4} style={{paddingTop: "16px"}}>
            {albums.map((album) => (
              <Grid item key={album._id} xs={12} sm={6} md={4} >
                <Card className={classes.card}>
                  <CardHeader 
                      avatar={
                        <Link to={"/Album/"+album._id} style={{ color:"inherit", textDecoration:"none" }}>
                          <Avatar aria-label="recipe" className={classes.purple}>
                            {album.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </Link>
                      }

                      title={<Link to={"/Album/"+album._id} style={{ color:"inherit", textDecoration:"none" }}><Typography variant="h6" displayInline>{album.name}</Typography></Link>}
                      subheader={<Typography variant="caption" gutterBottom displayInline>{"il y a "+getTimeDiff(album.dateCreated)}</Typography>}
                  />
                  <CardContent className={classNames(classes.cardContent, classes.gridContent)}>
                    <Scrollbars autoHide autoHeight>
                      <GridList cellHeight={150}>
                        {album.photos.map((photo) => (
                          <GridListTile key={photo._id} cols={1}>
                            <img src={"/images/photos/medium/"+photo.src} alt={photo.src} />
                          </GridListTile>
                        ))}
                      </GridList>
                    </Scrollbars>
                </CardContent>

                <CardActions>
                    <Link to={"/Album/"+album._id}>
                        <Button size="small" color="primary">{album.nbLikes} Likes</Button>
                    </Link>
                    <Link to={"/Album/"+album._id}>
                        <Button size="small" color="primary">{album.nbCommentaires} Commentaires</Button>
                    </Link>
                    <Link to={"/Album/"+album._id}>
                        <Button size="small" color="primary">{album.nbVues} Vues</Button>
                    </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
          </Grid>
      )}
    </Container>
  );
};