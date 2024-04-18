import React from 'react';
import {useParams} from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';

import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import FavoriteIcon from '@material-ui/icons/Favorite';

// import toastr from 'toastr'
// import 'toastr/build/toastr.min.css'

import albumService from "../../services/albums";

const moment = require("moment");

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(8),
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
  gridContent: {
    paddingTop: theme.spacing(2),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));


function getTimeDiff(dateCreated){
  let now = moment(Date.now());
  let last = moment(dateCreated);
  let seconds = now.diff(last, 'seconds'),
      minutes = now.diff(last, 'minutes'),
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
    if((seconds-minutes*60)>0)
      return minutes+" minutes et "+(seconds-minutes*60)+" secondes";
    else
      return minutes+" minutes";
  if(seconds>0)
    return seconds+" secondes";
}



export default function Album(props) {
  const classes = useStyles();
  let { id } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [banned, setBanned] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorRequest, setErrorRequest] = React.useState(false);
  const [album, setAlbum] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    if(!id){
      setLoading(false);
      setError("Pas d'identifiant");
    }else{
      albumService.get(id).then(rep => {
        if(rep.data.error){
          setAlbum(rep.data.album);
          setErrorRequest(rep.data.error);
        }else{
          setBanned(rep.data.isBanned);
          setAlbum(rep.data);
          setPhotos(rep.data.photos);
        }
        setLoading(false);
      }, err => {
        setError("Erreur "+err.response.status+" : "+err.response.data);
        setLoading(false);
      })
    }
  }, [id]);

  return (
    <Container className={classes.cardGrid} maxWidth={false}>
      {loading ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
        ) : (error ? (
            <Typography variant="body2" color="textSecondary" align="center">{error}</Typography>
          ) : (banned ? (
              <Typography variant="body2" color="textSecondary" align="center">Vous n'avez pas acces à cet album</Typography>
            ) : (
          <div>
            <Grid container spacing={3}>
              <Grid item>
                {album.author.picture !== "false" ? (
                    <Avatar className={classes.large} alt={album.author.prenom+" "+album.author.nom} src={"/images/users/small/"+album.author.picture} />
                  ) : (
                    <Avatar className={classes.large}><AccountCircle style={{ fontSize: 50 }} /></Avatar>
                  )
                }
              </Grid>
              <Grid item>
                <Typography variant="h6" displayInline>
                  {album.name}
                </Typography>
                <Typography variant="caption" gutterBottom displayInline>
                    {"il y a "+getTimeDiff(album.dateCreated)}
                </Typography>
              </Grid>
              <Grid item alignContent="center" alignItems="center">
                <Typography variant="body2" color="textSecondary" align="center">{album.description}</Typography>
              </Grid>
              <Grid item alignContent="flex-end" alignItems="flex-end">
                {album.tags.map(tag => (
                  <Link to={"/Album/Tag/"+tag.value} style={{padding:6}}><Chip label={tag.value} clickable color="primary" /></Link>
                ))}
              </Grid>
            </Grid>
            {errorRequest ? (
              <Typography variant="body2" color="textSecondary" align="center">{errorRequest}</Typography>
            ) : (
            <Grid container spacing={4} className={classes.gridContent}>
              {photos.map(photo => (
                <Grid item key={photo._id} xs={12} sm={6} md={3}>
                  <Card className={classes.card}>
                    <Link to={"/Photos/"+photo._id}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={"/images/photos/medium/"+photo.src}
                      />
                    </Link>
                    <CardActions>
                      <Link to={"/Photos/"+photo._id}>
                        <Button size="small" color="primary">{photo.nbLikes} Likes</Button>
                      </Link>
                      <Link to={"/Photos/"+photo._id}>
                        <Button size="small" color="primary">{photo.nbCommentaires} Commentaires</Button>
                      </Link>  
                      <Link to={"/Photos/"+photo._id}>
                        <Button size="small" color="primary">{photo.nbVues} Vues</Button>
                      </Link>                  
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            )}
          </div>
          ))
        )}
      </Container>
  );
}