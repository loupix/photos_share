import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, Link } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import userService from "../../services/users";
import friendService from "../../services/friends";

import { deepOrange, deepPurple } from '@material-ui/core/colors';

import { Scrollbars } from 'react-custom-scrollbars';

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
  const [error, setError] = React.useState(false);
  const [errorRequest, setErrorRequest] = React.useState(false);
  const [isFriend, setIsFriend] = React.useState(false);
  const [isRequested, setIsRequested] = React.useState(false);
	const [user, setUser] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    userService.get(id).then(rep => {
      if(rep.data.error){
        setUser(rep.data.user);
        setErrorRequest(rep.data.error);
      }else{
        setUser(rep.data);
        setErrorRequest(false);
      }
      setIsFriend(props.profile.friends.map(u => u._id).includes(id))
      setIsRequested(props.profile.friendRequests_send.map(r => r.to._id).includes(id))
      setLoading(false);
    }, err => {
      setError("Erreur "+err.response.status+" : "+err.response.data);
      setLoading(false);
    });
  }, [id]);


  const handleAddFriend = (event) => {
    event.preventDefault();
    friendService.add(id).then(rep => {
      props.setProfile(rep.data.user);
      setIsFriend(props.profile.friends.map(u => u._id).includes(id))
      setIsRequested(props.profile.friendRequests_send.map(r => r.to._id).includes(id))
      toastr.success("Amis ajouter", "Succes");
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleDelFriend = (event) => {
    event.preventDefault();
    friendService.remove(id).then(rep => {
      props.setProfile(rep.data.user);
      setIsFriend(props.profile.friends.map(u => u._id).includes(id))
      setIsRequested(props.profile.friendRequests_send.map(r => r.to._id).includes(id))
      toastr.success("Amis effacer", "Succes");
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


	return (
		<Container className={classes.cardGrid} maxWidth={false}>
		{loading ? (
			<Backdrop className={classes.backdrop} open={true}>
		  <CircularProgress color="inherit" />
		</Backdrop>
		) : (error ? (
      <Typography variant="body2" color="textSecondary" align="center">{error}</Typography>
    ) : (
    <div>

      <Grid container spacing={3}>
        <Grid item>
          {user.picture !== "false" ? (
              <Avatar className={classes.large} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture} />
            ) : (
              <Avatar className={classes.large}><AccountCircle style={{ fontSize: 50 }} /></Avatar>
            )
          }
        </Grid>
        <Grid item>
          <Typography variant="h6" displayInline>
            {user.validated ? (user.prenom+" "+user.nom) : user.email}
          </Typography>
          <Typography variant="caption" gutterBottom displayInline>
              {"il y a "+getTimeDiff(user.createdAt)}
          </Typography>
        </Grid>
        <Grid item justify="center">
          {isFriend ? (
            isRequested ? (
              <Chip label="Annuler l'invitation" icon={<HighlightOffIcon />} color="primary" variant="outlined" clickable onClick={handleDelFriend} />
            ) : (
              <Chip label="Retirer de mes amis" icon={<HighlightOffIcon />} color="primary" variant="outlined" clickable onClick={handleDelFriend} />
          )) : (
            <Chip label="Envoyer une invitation" icon={<CheckCircleOutlineIcon />} color="primary" clickable onClick={handleAddFriend} />
          )}
        </Grid>
      </Grid>

      {errorRequest ? (
        <Typography variant="body2" color="textSecondary" align="center">{errorRequest}</Typography>
      ) : (
      <Grid container spacing={4}>
      {user.albums.map((album) => (
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
      </div>
		))}
    </Container>
	)
};