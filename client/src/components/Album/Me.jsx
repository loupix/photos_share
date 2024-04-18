import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VisibilityIcon from '@material-ui/icons/Visibility';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ChipInput from 'material-ui-chip-input'

import { deepOrange, deepPurple } from '@material-ui/core/colors';

import { Scrollbars } from 'react-custom-scrollbars';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import albumService from "../../services/albums";

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
    cardFriend: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
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

export default function (props) {
	const classes = useStyles();

  const [loading, setLoading] = React.useState(true);
  const [albums, setAlbums] = React.useState([]);
  const [usersAlbum, setUsersAlbum] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openRestrict, setOpenRestrict] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [loadEdit, setLoadEdit] = React.useState(false);
  const [loadRestrict, setLoadRestrict] = React.useState(false);

  const [albumId, setAlbumId] = React.useState(null);

  const [title, setTitle] = React.useState("");
  const [titleError, setTitleError] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date(Date.now()).toISOString().split('T')[0]);
  const [selectedDateError, setSelectedDateError] = React.useState(false);



  const handleTitle = (event) => {
    setTitle(event.target.value);
    if(!event.target.value)
      setTitleError(true);
    else
      setTitleError(false);
  }

  const handleDescription = (event) => {
    setDescription(event.target.value);
  }

  const handleTagsAdd = (tag) => {
    const nTags = [...tags]
    nTags.push(tag);
    setTags(nTags);
  }

  const handleTagsDelete = (tag, index) => {
    const nTags = [...tags]
    nTags.splice(index, 1);
    setTags(nTags);
  }

  const handleDate = (event) => {
    setSelectedDate(event.target.value);
    if(!event.target.value)
      setSelectedDateError(true);
    else
      setSelectedDateError(false);
  }




  const handleMenu = (event, album_id) => {
    setAnchorEl(event.currentTarget);
    setAlbumId(album_id);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleDelete = () => {
    setAnchorEl(null);
    setOpenDelete(true);
  }

  const handleDeleteAccepted = (event) => {
    albumService.remove(albumId).then(rep => {
      setOpenDelete(false);
      toastr.success("Album supprimer","Succes");
      setAlbums(rep.data);
      let p = {...props.profile};
      p.albums = rep.data;
      props.setProfile(p);
    }, err => {
      setOpenDelete(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }

  const handleDeleteClose = (event) => {
    setOpenDelete(false);
  }




  const handleRestrict = (event) => {
    setOpenRestrict(true);
    setLoadRestrict(true);
    albumService.getBanned(albumId).then(rep => {
      setUsersAlbum(rep.data);
      setLoadRestrict(false);
    }, err => {
      setLoadRestrict(false);
      setOpenRestrict(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }

  const handleAddBanned = (event, user) => {
    albumService.addBanned(albumId, user._id).then(rep => {
      setUsersAlbum(rep.data);
      toastr.success("Utilisateur restrinct", "Restriction");
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleDelBanned = (event, user) => {
    albumService.delBanned(albumId, user._id).then(rep => {
      setUsersAlbum(rep.data);
      toastr.success("Utilisateur non restreint", "Restriction");
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }

  const handleRestrictClose = (event) => {
    setOpenRestrict(false);
  }



  const handleEdit = (event) => {
    setOpenEdit(true);
    setLoadEdit(true);
    albumService.get(albumId).then(rep => {
      setLoadEdit(false);
      setTitle(rep.data.name);
      setDescription(rep.data.description);
      setSelectedDate(new Date(rep.data.dateCreated));
      setTags(rep.data.tags.map(t => t.value));
    }, err => {
      setOpenEdit(false);
      setLoadEdit(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }

  const handleEditAccepted = (event) => {
    setLoadEdit(true);
    albumService.update(albumId, title, description, selectedDate, tags).then(rep => {
      setOpenEdit(false);
      setLoadEdit(false);
      let pos = albums.map(a => a._id).indexOf(rep.data._id);
      albums[pos] = rep.data;
      setAlbums(albums);
    }, err => {
      setOpenEdit(false);
      setLoadEdit(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }

  const handleEditClose = (event) => {
    setOpenEdit(false);
  }


  const isRequested = (user) => {
    let pos = props.profile.friendRequests_send.map(r => r.to._id).indexOf(user._id);
    let request = props.profile.friendRequests_send[pos];
    if(request.vue)
      return request.accepted;
    return request.vue;
  }


  React.useEffect(() => {
    albumService.getMe().then(rep => {
      setLoading(false);
      setAlbums(rep.data);
    }, err => {
      setLoading(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    });
  }, [props.profile.albums.length]);


	return (
		<Container className={classes.cardGrid} maxWidth={false}>
      <Grid container spacing={3}>
        <Grid item>
          {props.profile.picture !== "false" ? (
              <Avatar alt={props.profile.prenom+" "+props.profile.nom} src={"/images/users/small/"+props.profile.picture} />
            ) : (
              <Avatar><AccountCircle fontSize="large"/></Avatar>
            )
          }
        </Grid>
        <Grid item>
          <Typography variant="h6" displayInline>
            Mes albums
          </Typography>
        </Grid>
      </Grid>
      {loading ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
        ) : (
        <Grid container spacing={4}>

          
{/*          Suppression d'album
*/}

          <Dialog open={openDelete} onClose={handleDeleteClose} aria-labelledby="supression-album" aria-describedby="supression-album-description">
            <DialogTitle id="supression-album">{"Voulez-vous supprimer cet album ?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="supression-album">
                Attention ! La supression de l'album effacera définitivement toutes les photos et fichier enregistrer sur le serveur.
              </DialogContentText>
              <DialogActions>
                <Button onClick={handleDeleteClose} color="primary">Ne rien faire</Button>
                <Button onClick={handleDeleteAccepted} color="primary">Oui, tout effacer</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>


{/*          Restriction utilisateur
*/}

          <Dialog open={openRestrict} onClose={handleRestrictClose} aria-labelledby="restrict-album" aria-describedby="restrict-album-description">
            <DialogTitle id="restrict-album-album">Restriction d'utilisateur</DialogTitle>
            <DialogContent>
              {loadEdit ? (
                <Backdrop className={classes.backdrop} open={true}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
              (usersAlbum.length === 0 ? (
                <div>
                  <DialogContentText id="restrict-album">
                    <Typography variant="body2" color="textSecondary" align="center">Aucuns amis à restreindre</Typography>
                  </DialogContentText>
                  <DialogActions>
                    <Button onClick={handleRestrictClose} color="primary">Annuler</Button>
                  </DialogActions>
                </div>
              ) : (
              <div>
                <DialogContentText id="restrict-album">
                  <Grid container spacing={4} className={classes.gridContent}>
                    {usersAlbum.map((user) => (
                      <Grid item key={user._id} >
                        <Card className={classes.cardFriend} 
                              style={user.banned ? {backgroundColor:"#3f51b5"} : {borderColor:"#3f51b5", borderSize:2}}
                              onClick={user.banned ? (event) => handleDelBanned(event, user) : (event) => handleAddBanned(event, user)}>
                          <CardHeader
                            avatar={
                              user.validated ? (
                                (isRequested(user) ? (
                                  (user.picture !== "false" ? (
                                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture}/> ) : ( 
                                    <Avatar className={classes.small}><AccountCircle/></Avatar>)
                                )) : (
                                    <Badge
                                        overlap="circle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                                        badgeContent={<VisibilityIcon fontSize="small" color="inherit" />} >
                                        {user.picture !== "false" ? (
                                        <Avatar className={classes.small} alt={user.validated ? user.prenom+" "+user.nom : user.email} src={"/images/users/small/"+user.picture}/> ) : ( 
                                        <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                                    </Badge>
                              ))) : (
                                  <Badge
                                    overlap="rectangle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                                    badgeContent={<EmailIcon fontSize="small" color="inherit" />} >
                                    {user.picture !== "false" ? (
                                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture}/> ) : ( 
                                    <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                                  </Badge>
                              )
                            }

                            title={<Typography variant="body2" displayInline>{user.validated ? (user.prenom+" "+user.nom) : (user.email)}</Typography>}
                            subheader={user.validated ? "Enregistrer" : "Non enregistrer"}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </DialogContentText>
                <DialogActions>
                  <Button onClick={handleRestrictClose} color="primary">Fermer</Button>
                </DialogActions>
              </div>
              )))}
            </DialogContent>
          </Dialog>


{/*          Modification de l'album
*/}

          <Dialog open={openEdit} onClose={handleEditClose} aria-labelledby="edit-album" aria-describedby="edit-album-description">
            <DialogTitle id="edit-album-album">Modifier les information de l'album</DialogTitle>
            <DialogContent>
              {loadEdit ? (
                <Backdrop className={classes.backdrop} open={true}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
              <div>
                <DialogContentText id="supression-album">
                    <TextField
                      error={titleError}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="title"
                      label="Titre de l'album"
                      name="title"
                      autoComplete="title"
                      onInput={handleTitle}
                      value={title}
                      autoFocus
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="description"
                      label="Desription de l'album"
                      name="description"
                      autoComplete="description"
                      onInput={handleDescription}
                      value={description}
                      multiline
                      rows={3}
                    />
                    <ChipInput
                      variant="outlined"
                      margin="normal"
                      id="tags"
                      label="Tags de l'album"
                      name="tags"
                      autoComplete="tags"
                      onAdd={(tag) => handleTagsAdd(tag)}
                      onDelete={(tag, index) => handleTagsDelete(tag, index)}
                      value={tags}
                      className={classes.inputTag}
                    />
                    &nbsp;
                    <TextField
                      error={selectedDateError}
                      required
                      variant="outlined"
                      margin="normal"
                      id="date"
                      label="Date de l'album"
                      type="date"
                      defaultValue={selectedDate}
                      className={classes.TextField}
                      onInput={handleDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                </DialogContentText>
                <DialogActions>
                  <Button onClick={handleEditClose} color="primary">Annuler</Button>
                  <Button onClick={handleEditAccepted} color="primary">Sauvegarder</Button>
                </DialogActions>
              </div>
              )}
            </DialogContent>
          </Dialog>


{/*          Menu pour les dialogs
*/}

          <Menu anchorEl={anchorEl} keepMounted onClose={handleMenuClose} open={open}>
            <MenuItem key="edit" onClick={handleEdit}>
              <ListItemIcon>
                <CreateIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Modifier</Typography>
            </MenuItem>
            <MenuItem key="delete" onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Supprimer</Typography>
            </MenuItem>
            <MenuItem key="banned" onClick={handleRestrict}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Limiter l'accès</Typography>
            </MenuItem>
          </Menu>


{/*          Affichage de mes albums
*/}

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

                    action={
                      <IconButton aria-label="settings" aria-haspopup="true" aria-controls={album._id} onClick={(event) => handleMenu(event, album._id)}>
                        <MoreVertIcon />
                      </IconButton>
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