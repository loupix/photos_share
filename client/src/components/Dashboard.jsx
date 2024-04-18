import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Collapse } from '@material-ui/core';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

import { Scrollbars } from 'react-custom-scrollbars';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import albumService from "../services/albums";
import userService from "../services/users";

const classNames = require("classnames");
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
    cPointer: {
        cursor: 'pointer'
    },
    mainFeaturedPost: {
        position: 'relative',
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainFeaturedPostContent: {
        position: 'relative',
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
          padding: theme.spacing(6),
          paddingRight: 0,
        },
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


export default function(props){
    const classes = useStyles();
    const history = useHistory();
    const { userId, invitId } = useParams();

    const [loading, setLoading] = React.useState(true);
    const [openCommentaires, setOpenCommentaires] = React.useState(false);
    const [openLikes, setOpenLikes] = React.useState(false);
    const [albums, setAlbums] = React.useState([]);
    const [commentaires, setCommentaires] = React.useState([]);
    const [likes, setLikes] = React.useState([]);

    React.useEffect(() => {

        if(invitId){
            userService.getInvitation(invitId).then(rep => {
                toastr.success("Invitation vérifier et validé", "Invitation");
            }, err => {
                if(err.response.status>400 && err.response.status<500)
                  toastr.warning(err.response.data, "Erreur " + err.response.status);
                else
                  toastr.error(err.response.data, "Erreur " + err.response.status);
            })
        }else if(userId){
            userService.validEmail(userId).then(rep => {
                toastr.success("Email vérifier et validé", "Vérification");
            }, err => {
                if(err.response.status>400 && err.response.status<500)
                  toastr.warning(err.response.data, "Erreur " + err.response.status);
                else
                  toastr.error(err.response.data, "Erreur " + err.response.status);
            })
        }


        albumService.getDashboard().then(rep => {
            setAlbums(rep.data.albums);
            setCommentaires(rep.data.commentaires);
            setLikes(rep.data.likes);
            setLoading(false);
        }, err => {
            setLoading(false);
            if(err.response.status>400 && err.response.status<500)
              toastr.warning(err.response.data, "Erreur " + err.response.status);
            else
              toastr.error(err.response.data, "Erreur " + err.response.status);
        })
    }, [0]);


    const handleOpenCommentaires = () => {
        setOpenCommentaires(!openCommentaires);
    }

    const handleOpenLikes = () => {
        setOpenLikes(!openLikes);
    }

    
    return (
        <Container className={classes.cardGrid} maxWidth={false}>
            {loading ? (
                <Backdrop className={classes.backdrop} open={true}>
                  <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
            <Grid container spacing={3}>
                <Grid item key="listAlbums" xs={12} sm={9}>
                    <Typography variant="h6" gutterBottom>
                            Derniers albums
                    </Typography>
                    <Divider />
                    <br />
                    {albums.length === 0 && (
                        <div>
                            <Typography variant="body2" color="textSecondary" align="center">Aucuns albums</Typography>
                            <Link to="/Album/Create" style={{ color:"inherit", textDecoration:"none" }}>
                                <Button color="primary" variant="contained" startIcon={<PhotoCamera />}>Créer un album</Button>
                            </Link>
                        </div>
                    )}
                    <Grid container spacing={4}>
                        {albums.map((album) => (
                            <Grid item key={album.id} xs={12} sm={6} md={4} >
                                <Card className={classes.card}>
                                    <CardHeader 
                                        avatar={
                                          <Link to={"/Users/"+album.author._id} style={{ color:"inherit", textDecoration:"none" }}>
                                            {album.author.picture !== "false" ? (
                                              <Avatar alt={album.author.prenom+" "+album.author.nom} src={"/images/users/small/"+album.author.picture}/> ) : ( 
                                              <Avatar><AccountCircle/></Avatar>)}
                                          </Link>
                                        }

                                        title={<Link to={"/Album/"+album._id} style={{ color:"inherit", textDecoration:"none" }}><Typography variant="h6" displayInline>{album.name}</Typography></Link>}
                                        subheader={<Typography variant="caption" gutterBottom displayInline>{"il y a "+getTimeDiff(album.dateCreated)}</Typography>}
                                    />
                                    <CardContent className={classNames(classes.cardContent, classes.gridContent)}>
                                        <Scrollbars autoHide autoHeight>
                                            <GridList cellHeight={150}>
                                                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                                                    <ListSubheader component="div">{album.title}</ListSubheader>
                                                </GridListTile>
                                                {album.photos.map((photo) => (
                                                    <GridListTile key={photo._id} cols={1} className={classes.photoClick}>
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
                </Grid>
                <Grid item key="ListCommetairesLikes" xs={12} sm={3}>
                    <Typography variant="h6" gutterBottom>
                        Derniers commentaires
                    </Typography>
                    <Divider />
                    {commentaires.length === 0 && (
                        <Typography variant="body2" color="textSecondary" align="center">Aucuns commentaires</Typography>
                    )}
                    {commentaires.length > 5 ? (
                        <div>
                            <List>
                                {commentaires.slice(0,5).map((comment) => (
                                    <div key={comment._id}>
                                        <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            {comment.author.picture !== "false" ? (
                                            <Avatar alt={comment.author.validated ? comment.author.prenom+" "+comment.author.nom : comment.author.email} src={"/images/users/small/"+comment.author.picture}/> ) : ( 
                                            <Avatar><AccountCircle/></Avatar>)}
                                        </ListItemAvatar>
                                        <ListItemText secondary={
                                            <div>
                                            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                                {comment.author.prenom+" "+comment.author.nom}
                                            </Typography>
                                            {" — "+comment.text}
                                            <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(comment.createdAt)}</Typography>
                                            </div>
                                        } />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </div>
                                ))}
                            </List>
                            <Collapse in={openCommentaires} timeout="auto" unmountOnExit>
                                <List>
                                    {commentaires.slice(5).map((comment) => (
                                        <div key={comment._id}>
                                            <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                {comment.author.picture !== "false" ? (
                                                <Avatar alt={comment.author.validated ? comment.author.prenom+" "+comment.author.nom : comment.author.email} src={"/images/users/small/"+comment.author.picture}/> ) : ( 
                                                <Avatar><AccountCircle/></Avatar>)}
                                            </ListItemAvatar>
                                            <ListItemText secondary={
                                                <div>
                                                <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                                    {comment.author.prenom+" "+comment.author.nom}
                                                </Typography>
                                                {" — "+comment.text}
                                                <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(comment.createdAt)}</Typography>
                                                </div>
                                            } />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </div>
                                    ))}
                                </List>
                            </Collapse>
                            <ListItem button onClick={handleOpenCommentaires}>
                                {openCommentaires ? <ExpandLess /> : <ExpandMore />}
                                <ListItemText primary={openCommentaires ? "Voir moins" : "Voir plus"} />
                            </ListItem>
                        </div>
                    ) : (
                    <List>
                        {commentaires.map((comment) => (
                        <div key={comment._id}>
                            <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {comment.author.picture !== "false" ? (
                                <Avatar alt={comment.author.validated ? comment.author.prenom+" "+comment.author.nom : comment.author.email} src={"/images/users/small/"+comment.author.picture}/> ) : ( 
                                <Avatar><AccountCircle/></Avatar>)}
                            </ListItemAvatar>
                            <ListItemText secondary={
                                <div>
                                <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                    {comment.author.prenom+" "+comment.author.nom}
                                </Typography>
                                {" — "+comment.text}
                                <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(comment.createdAt)}</Typography>
                                </div>
                            } />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                        ))}
                    </List>
                    )}

                    <Typography variant="h6" gutterBottom>
                        Derniers likes
                    </Typography>
                    <Divider />
                    {likes.length === 0 && (
                        <Typography variant="body2" color="textSecondary" align="center">Aucuns likes</Typography>
                    )}
                    {likes.length > 5 ? (
                        <div>
                            <List>
                                {likes.slice(0,5).map((like) => (
                                <div key={like._id}>
                                    <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        {like.author.picture !== "false" ? (
                                        <Avatar alt={like.author.validated ? like.author.prenom+" "+like.author.nom : like.author.email} src={"/images/users/small/"+like.author.picture}/> ) : ( 
                                        <Avatar><AccountCircle/></Avatar>)}
                                    </ListItemAvatar>
                                    <ListItemText secondary={
                                        <div>
                                        <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                            {like.author.prenom+" "+like.author.nom}
                                        </Typography>
                                        <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(like.createdAt)}</Typography>
                                        </div>
                                    } />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </div>
                                ))}
                            </List>
                            <Collapse in={openLikes} timeout="auto" unmountOnExit>
                                <List>
                                    {likes.slice(5).map((like) => (
                                    <div key={like._id}>
                                        <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            {like.author.picture !== "false" ? (
                                            <Avatar alt={like.author.validated ? like.author.prenom+" "+like.author.nom : like.author.email} src={"/images/users/small/"+like.author.picture}/> ) : ( 
                                            <Avatar><AccountCircle/></Avatar>)}
                                        </ListItemAvatar>
                                        <ListItemText secondary={
                                            <div>
                                            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                                {like.author.prenom+" "+like.author.nom}
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(like.createdAt)}</Typography>
                                            </div>
                                        } />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </div>
                                    ))}
                                </List>
                            </Collapse>
                            <ListItem button onClick={handleOpenLikes}>
                                {openLikes ? <ExpandLess /> : <ExpandMore />}
                                <ListItemText primary={openLikes ? "Voir moins" : "Voir plus"} />
                            </ListItem>
                        </div>
                    ) : (
                    <List>
                        {likes.map((like) => (
                        <div key={like._id}>
                            <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {like.author.picture !== "false" ? (
                                <Avatar alt={like.author.validated ? like.author.prenom+" "+like.author.nom : like.author.email} src={"/images/users/small/"+like.author.picture}/> ) : ( 
                                <Avatar><AccountCircle/></Avatar>)}
                            </ListItemAvatar>
                            <ListItemText secondary={
                                <div>
                                <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                    {like.author.prenom+" "+like.author.nom}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>{"il y a "+getTimeDiff(like.createdAt)}</Typography>
                                </div>
                            } />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                        ))}
                    </List>
                    )}

                </Grid>
            </Grid>
        )}
        </Container>
    );
}