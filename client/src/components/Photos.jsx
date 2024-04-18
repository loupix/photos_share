import React from 'react';
import { useParams, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';

import photosService from '../services/photos';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const moment = require("moment");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
    position:'relative',
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
  
  inline: {
    display: 'inline',
  },
  overlay: {
    position: 'absolute',
    top: '2%',
    left: '94%',
  },
  listCommentaires:{
    paddingTop: theme.spacing(7),
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



export default function(props) {
  const classes = useStyles();
  let { id } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [banned, setBanned] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  const [nextPhoto, setNextPhoto] = React.useState(false);
  const [commentaires, setCommentaires] = React.useState(false);
  const [commentaire, setCommentaire] = React.useState("");
  const [submit, setSubmit] = React.useState(false);
  const [IsLiked, setIsLiked] = React.useState(false);


  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setBanned(false);
    if(!id){
      setLoading(false);
      setError("Pas d'identifiant");
    }else{
      photosService.get(id).then(rep => {
        setBanned(rep.data.photo.album.isBanned);
        setPhoto(rep.data.photo);
        setNextPhoto(rep.data.next);
        setCommentaires(rep.data.photo.commentaires);
        setIsLiked(rep.data.photo.likes.map(l => l.author._id).includes(props.profile._id))
        setLoading(false);
      }, err => {
        setError("Erreur "+err.response.status+" : "+err.response.data);
        setLoading(false);
      })
    }
  }, [id]);


  const handleComment = (event) => {
    setCommentaire(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmit(true);
    photosService.addComment(commentaire, id).then(rep => {
      setCommentaires(rep.data);
      setCommentaire("");
      setSubmit(false);
    }, err => {
      setSubmit(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleDeleteCom = (event, comment_id) => {
    event.preventDefault();
    photosService.delComment(comment_id, id).then(rep => {
      setCommentaires(rep.data)
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleLiked = (event) => {
    if(IsLiked){
      photosService.delLike(id).then(rep => {
        setBanned(rep.data.photo.album.isBanned);
        setPhoto(rep.data.photo);
        setNextPhoto(rep.data.next);
        setCommentaires(rep.data.photo.commentaires);
        setIsLiked(rep.data.photo.likes.map(l => l.author._id).includes(props.profile._id))
      }, err => {
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      });
    }else{
      photosService.addLike(id).then(rep => {
        setBanned(rep.data.photo.album.isBanned);
        setPhoto(rep.data.photo);
        setNextPhoto(rep.data.next);
        setCommentaires(rep.data.photo.commentaires);
        setIsLiked(rep.data.photo.likes.map(l => l.author._id).includes(props.profile._id))
      }, err => {
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      });
    }
  }


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
      <Grid container spacing={3}>
        <Grid item key={props.id} xs={12} sm={9}>

              <Grid container spacing={3}>
                <Grid item>
                  {photo.author.picture !== "false" ? (
                      <Avatar className={classes.large} alt={photo.author.prenom+" "+photo.author.nom} src={"/images/users/small/"+photo.author.picture} />
                    ) : (
                      <Avatar className={classes.large}><AccountCircle style={{ fontSize: 50 }} /></Avatar>
                    )
                  }
                </Grid>
                <Grid item>
                  <Typography variant="h6" displayInline>
                    {photo.album.name}
                  </Typography>
                  <Typography variant="caption" gutterBottom displayInline>
                      {"Il y a "+getTimeDiff(photo.album.dateCreated)}
                  </Typography>
                </Grid>
              </Grid>
          {/* <Divider /> */}
          <Card className={classes.card}>
            <Link to={"/Photos/"+nextPhoto} style={{ color:"inherit", textDecoration:"none" }}>
              <CardMedia
                className={classes.cardMedia}
                image={"/images/photos/original/"+photo.src}
              />
            </Link>
            <IconButton aria-label={photo._id} className={classes.overlay} onClick={handleLiked}>
              {IsLiked ? (
                <FavoriteIcon style={{ fontSize: 40 }} color="secondary" />
              ) : (
                <FavoriteBorderIcon style={{ fontSize: 40, color:"white" }} />
              )}
            </IconButton>
          </Card>
        </Grid>
        <Grid item key={props.id} xs={12} sm={3}>
          <Typography variant="subtitle1" gutterBottom className={classes.listCommentaires}>
              ({commentaires.length}) commentaires
          </Typography>
          <Divider />
          <List>
            {commentaires.map((comment) => (
              <React.Fragment>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {comment.author.picture !== "false" ? (
                      <Avatar alt={comment.author.prenom+" "+comment.author.nom} src={"/images/users/small/"+comment.author.picture} />
                    ) : (
                      <Avatar><AccountCircle fontSize="large"/></Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                        {comment.author.prenom+" "+comment.author.nom}
                      </Typography>
                      {" — "+comment.text}
                      <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(comment.updatedAt)}</Typography>
                    </React.Fragment>
                  } />
                  {props.profile._id === comment.author._id && (
                    <ListItemSecondaryAction size="small" onClick={(event) => handleDeleteCom(event, comment._id)} key={comment._id}>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>  
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
            <ListItem alignItems="flex-start">
              <Grid container spacing={1}>
                <Grid item>
                  {props.profile.picture !== "false" ? (
                    <Avatar alt={props.profile.prenom+" "+props.profile.nom} src={"/images/users/small/"+props.profile.picture} />
                  ) : (
                    <Avatar><AccountCircle fontSize="large"/></Avatar>
                  )}
                </Grid>
                <Grid item>
                  <form onSubmit={handleSubmit}>
                    <TextField id="input-with-icon-grid" label="Commentaire" fullWidth 
                      disabled={submit}
                      value={commentaire} 
                      onChange={handleComment} />
                  </form>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      )))}
    </Container>

  );
}