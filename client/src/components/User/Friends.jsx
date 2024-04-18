import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

// import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import { deepOrange, deepPurple } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VisibilityIcon from '@material-ui/icons/Visibility';

// import userService from "../../services/users";
import friendService from "../../services/friends";
import requestService from "../../services/requests";

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'


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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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


export default function(props) {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(true);
  const [friends, setFriends] = React.useState([]);
  const [requestSend, setRequestSend] = React.useState([]);
  const [requestReceive, setRequestReceive] = React.useState([]);
  const [newRequestReceive, setNewRequestReceive] = React.useState(0);
  const [tabValue, setTabValue] = React.useState(0);

  React.useEffect(() => {
    requestService.getAll().then(rep => {
      setLoading(false);
      setFriends(rep.data.friends);
      setRequestReceive(rep.data.receive);
      setRequestSend(rep.data.send);
      if(rep.data.receive.length > 0)
        setNewRequestReceive(rep.data.receive.filter(r => !r.vue).length);
      props.setNewRequest(rep.data.receive.filter(r => !r.vue).length);
    }, err => {
      setLoading(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }, [0]);

  const handleDelFriend = (event, user_id) => {
    event.preventDefault();
    friendService.remove(user_id).then(rep => {
      props.setProfile(rep.data.user);
      toastr.success("Amis effacer", "Succes");
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleAcceptedRequest = (event, request) => {
    event.preventDefault();
    requestService.accepted(request._id).then(rep => {
      requestService.getAll().then(rep => {
        setFriends(rep.data.friends);
        setRequestSend(rep.data.send);
        setRequestReceive(rep.data.receive);
        if(rep.data.receive.length > 0)
          setNewRequestReceive(rep.data.receive.filter(r => !r.vue).length);
        props.setNewRequest(rep.data.receive.filter(r => !r.vue).length);
        let p = {...props.profile}
        p.friends = rep.data.friends;
        p.friendRequests_receive = requestReceive;
        p.friendRequests_send = requestSend;
        props.setProfile(p);
      }, err => {
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      })
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleRefusedRequest = (event, request) => {
    event.preventDefault();
    requestService.refused(request._id).then(rep => {
      requestService.getAll().then(rep => {
        setFriends(rep.data.friends);
        setRequestSend(rep.data.send);
        setRequestReceive(rep.data.receive);
        if(rep.data.receive.length > 0)
          setNewRequestReceive(rep.data.receive.filter(r => !r.vue).length);
        props.setNewRequest(rep.data.receive.filter(r => !r.vue).length);
        let p = {...props.profile}
        p.friends = rep.data.friends;
        p.friendRequests_receive = requestReceive;
        p.friendRequests_send = requestSend;
        props.setProfile(p);
      }, err => {
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      })
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleRemoveRequest = (event, request) => {
    event.preventDefault();
    requestService.remove(request._id).then(rep => {
      requestService.getAll().then(rep => {
        setFriends(rep.data.friends);
        setRequestSend(rep.data.send);
        setRequestReceive(rep.data.receive);
        if(rep.data.receive.length > 0)
          setNewRequestReceive(rep.data.receive.filter(r => !r.vue).length);
        props.setNewRequest(rep.data.receive.filter(r => !r.vue).length);
        let p = {...props.profile}
        p.friends = friends;
        p.friendRequests_receive = requestReceive;
        p.friendRequests_send = requestSend;
        props.setProfile(p);
      }, err => {
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      })
    }, err => {
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }


  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    // if(newValue===1 && newRequestReceive > 0){
    //   requestService.setVueAll().then(rep => {
    //     setRequestReceive(rep.data);
    //   }, err => {
    //     if(err.response.status>400 && err.response.status<500)
    //       toastr.warning(err.response.data, "Erreur " + err.response.status);
    //     else
    //       toastr.error(err.response.data, "Erreur " + err.response.status);
    //   });
    // }
  }


  const isRequested = (user) => {
    if(props.profile === null || user === null || !props.profile || !user)
      return false;
    let pos = props.profile.friendRequests_send.map(r => r.to._id).indexOf(user._id);
    if(pos !== -1){
      let request = props.profile.friendRequests_send[pos];
      if(request.vue)
        return request.accepted;
      return request.vue;
    }else
      return true;
  }


  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >{children}</div>
    )
  }


  return (
    <Container className={classes.cardGrid} maxWidth={false}>
    {loading ? (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    ) : (
    <div>
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
            Mes amis
          </Typography>
        </Grid>
      </Grid>

      <Tabs value={tabValue} 
            indicatorColor="primary" 
            textColor="primary" 
            onChange={handleChangeTab} 
            centered 
            aria-label="disabled tabs example">

          {friends.length>0 ? (
            <Tab label={"Mes amis ("+friends.length+")"} />
          ) : (
            <Tab label="Mes amis" />
          )}

          {requestReceive.length>0 ? (
            <Tab label={"Mes invitations reçus ("+requestReceive.length+")"} />
          ) : (
            <Tab label="Mes invitations reçus" />
          )}

          {requestSend.length>0 ? (
            <Tab label={"Mes invitations envoyés ("+requestSend.length+")"} />
          ) : (
            <Tab label="Mes invitations envoyés" />
          )}
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {props.profile.friends.length === 0 && (
          <div>
          <br /><br />
          <Typography variant="body2" color="textSecondary" align="center">Aucuns amis</Typography>
          </div>
        )}
        <Grid container spacing={4} className={classes.gridContent}>
        {friends.map((user) => (
              <Grid item key={user._id} >
                <Card>
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

                    title={<Link to={"/Users/"+user._id} style={{ color:"inherit", textDecoration:"none" }}>
                        <Typography variant="body2" displayInline>{user.validated ? (user.prenom+" "+user.nom) : (user.email)}</Typography>
                      </Link>}
                    subheader={user.validated ? "Enregistrer" : "Non enregistrer"}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{user.albums.length} Albums    {user.friends.length} Amis</Typography>
                  </CardContent>
                  <CardActions>
                      <Button size="small" color="primary" onClick={(event) => handleDelFriend(event, user._id)}>
                      Retirer de mes amis
                      </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {requestReceive.length === 0 && (
          <div>
          <br /><br />
          <Typography variant="body2" color="textSecondary" align="center">Aucunes invitations reçus</Typography>
          </div>
        )}
        <Grid container spacing={4} className={classes.gridContent}>
          {requestReceive.map((request) => {
            const user = request.from;
            return (
            <Grid item key={user._id} >
                <Card>
                  <CardHeader
                    avatar={
                      user.picture !== "false" ? (
                        <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture}/> ) : ( 
                        <Avatar className={classes.small}><AccountCircle/></Avatar>)
                  }

                    title={<Link to={"/Users/"+user._id} style={{ color:"inherit", textDecoration:"none" }}>
                        <Typography variant="body2" displayInline>{user.validated ? (user.prenom+" "+user.nom) : (user.email)}</Typography>
                      </Link>}
                    subheader={user.validated ? "Enregistrer" : "Non enregistrer"}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{user.albums.length} Albums    {user.friends.length} Amis</Typography>
                  </CardContent>
                  <CardActions>
                      <Button size="small" color="primary" onClick={(event) => handleAcceptedRequest(event, request)}>
                      Accepter
                      </Button>
                      <Button size="small" color="secondary" onClick={(event) => handleRefusedRequest(event, request)}>
                      Refuser
                      </Button>
                  </CardActions>
                </Card>
              </Grid>
            )})}
        </Grid>
      </TabPanel>


      <TabPanel value={tabValue} index={2}>
        {requestSend.length === 0 && (
          <div>
          <br /><br />
          <Typography variant="body2" color="textSecondary" align="center">Aucunes invitations envoyés</Typography>
          </div>
        )}
        <Grid container spacing={4} className={classes.gridContent}>
          {requestSend.map((request) => {
            let user = request.to;
            return (
            <Grid item key={user._id} >
                <Card>
                  <CardHeader
                    avatar={
                      user.validated ? (
                          (user.picture !== "false" ? (
                            <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture}/> ) : ( 
                            <Avatar className={classes.small}><AccountCircle/></Avatar>)
                      )) : (
                          <Badge
                            overlap="rectangle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                            badgeContent={<EmailIcon fontSize="small" color="inherit" />} >
                            {user.picture !== "false" ? (
                            <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture}/> ) : ( 
                            <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                          </Badge>
                      )
                  }

                    title={<Link to={"/Users/"+user._id} style={{ color:"inherit", textDecoration:"none" }}>
                        <Typography variant="body2" displayInline>{user.validated ? (user.prenom+" "+user.nom) : (user.email)}</Typography>
                      </Link>}
                    subheader={user.validated ? "Enregistrer" : "Non enregistrer"}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{user.albums.length} Albums    {user.friends.length} Amis</Typography>
                  </CardContent>
                  <CardActions>
                      <Button size="small" color="secondary" onClick={(event) => handleRemoveRequest(event, request)}>
                      Annuler
                      </Button>
                  </CardActions>
                </Card>
              </Grid>
          )})}
        </Grid>
      </TabPanel>
    </div>
  )}
    </Container>
  )
};