import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import LinkUrl from '@material-ui/core/Link';
import Badge from '@material-ui/core/Badge';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';

// import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';

import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import AlbumGet from './components/Album/Get.jsx';
import AlbumTags from './components/Album/Tags.jsx';
import AlbumFind from './components/Album/Find.jsx';
import AlbumCreate from './components/Album/Create.jsx';
import AlbumMe from './components/Album/Me.jsx';
import UserAdd from './components/User/Add.jsx';
import UserMe from './components/User/Me.jsx';
import UserGet from './components/User/Get.jsx';
import UserFriends from './components/User/Friends.jsx';
import Photos from './components/Photos.jsx';
import Dashboard from './components/Dashboard.jsx';
import Homepage from './components/Homepage.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ChangePassword from './components/ChangePassword.jsx';

// import Choice from '@material-ui/core/Switch';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormGroup from '@material-ui/core/FormGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Collapse } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import AddIcons from '@material-ui/icons/Add';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EmailIcon from '@material-ui/icons/Email';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import RemoveIcons from '@material-ui/icons/Remove';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

import userService from "./services/users";

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const classNames = require("classnames");

const drawerWidth = 240;

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}


ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <LinkUrl color="inherit" href="https://photos.loicdaniel.fr/">
        photos.loicdaniel.fr
      </LinkUrl>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    // overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  dNone: {
    display: 'none',
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
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function App(props) {
  const classes = useStyles();

  const [auth, setAuth] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [newRequest, setNewRequest] = React.useState(0);

  React.useEffect(() => {
    userService.isAuth().then(rep => {
      if(rep){
        userService.getMe().then(rep => {
          setProfile(rep.data.user);
          setNewRequest(rep.data.user.friendRequests_receive.filter(r => !r.vue).length)
          setAuth(true);
          setLoading(false);
          setOpenBackdrop(true);
        })
      }else{
        setAuth(rep);
        setLoading(false);
        setOpenBackdrop(true);
      }
    }, err => {
      setAuth(false);
      setLoading(false);
      setOpenBackdrop(true);
    });
  }, [0]);

  const isRequested = (user) => {
    if(profile === null || user === null || !profile || !user)
      return false;
    let pos = profile.friendRequests_send.map(r => r.to._id).indexOf(user._id);
    if(pos !== -1){
      let request = profile.friendRequests_send[pos];
      if(request.vue)
        return request.accepted;
      return request.vue;
    }else
      return true;
  }

  // const location = useLocation();

  // React.useEffect(() => {
  //   console.log('Location changed');
  // }, [location]);

  // const [auth] = React.useState(true);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openFriends, setOpenFriends] = React.useState(false);
  const [openAlbums, setOpenAlbums] = React.useState(false);
  const openMenuProfile = Boolean(anchorEl);



  const handleOpenFriends = () => {
    setOpenFriends(!openFriends);
  }

  const handleOpenAlbums = () => {
    setOpenAlbums(!openAlbums);
  }

  // setAuth(true)
  const list = ({friends=[], albums=[]}) => (
    <React.Fragment>
      <ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon />} key="Dashboard" />

      <ListItemLink to="/Users/Friends" primary="Mes Amis" icon={
        profile.friendRequests_receive.length>0 ? (
          <Badge
            overlap="circle" anchorOrigin={{vertical:"top", horizontal:"right"}}
            badgeContent={profile.friendRequests_receive.length} color="secondary">
              <PeopleAltIcon />
          </Badge>
        ) : (<PeopleAltIcon />)
      } key="mesAmis" />
      <ListItemLink to="/Album/Me" primary="Mes Albums" icon={<PhotoCamera />} key="mesAlbums" />
      <ListItemLink to="/Album/Find" primary="Recherche d'albums" icon={<SearchIcon />} key="findAlbums" />
      <Divider />
      <ListItemLink to="/Users/Add" primary="Rechercher un amis" icon={<Avatar className={classNames(classes.purple, classes.small)}><PersonAddIcon fontSize="small" /></Avatar>} key="addUSer" />
      {friends.length > 5 ? (
        <div>
          {friends.slice(0,5).map((user) => (
            <div>
              {user.validated ? (
                (isRequested(user) ? (
                  <ListItemLink to={"/Users/"+user._id} primary={user.validated ? user.prenom+" "+user.nom : user.email } key={user._id}
                  icon={user.picture !== "false" ? (
                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/user/small/"+user.picture}/> ) : ( 
                    <Avatar className={classes.small}><AccountCircle/></Avatar>)} />
                ) : (
                  <ListItemLink to={"/Users/"+user._id} primary={user.validated ? user.prenom+" "+user.nom : user.email } key={user._id}
                    icon={
                      <Badge
                        overlap="circle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                        badgeContent={<VisibilityIcon fontSize="small" color="inherit" />} >
                        {user.picture !== "false" ? (
                        <Avatar className={classes.small} alt={user.validated ? user.prenom+" "+user.nom : user.email} src={"/images/user/small/"+user.picture}/> ) : ( 
                        <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                    </Badge>} />
              ))) : (
                <li><ListItem>
                  <ListItemIcon>
                  <Badge
                    overlap="rectangle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                    badgeContent={<EmailIcon fontSize="small" color="inherit" />} >
                    {user.picture !== "false" ? (
                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/user/small/"+user.picture}/> ) : ( 
                    <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                  </Badge>
                  </ListItemIcon>
                  <ListItemText primary={user.email} />
                </ListItem></li>
              )}
            </div>
          ))}

          <Collapse in={openFriends} timeout="auto" unmountOnExit>
            {friends.slice(5).map((user) => (
               <div>
                {user.validated ? (
                (isRequested(user) ? (
                  <ListItemLink to={"/Users/"+user._id} primary={user.validated ? user.prenom+" "+user.nom : user.email } key={user._id}
                  icon={user.picture !== "false" ? (
                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/user/small/"+user.picture}/> ) : ( 
                    <Avatar className={classes.small}><AccountCircle/></Avatar>)} />
                ) : (
                  <ListItemLink to={"/Users/"+user._id} primary={user.validated ? user.prenom+" "+user.nom : user.email } key={user._id}
                    icon={
                      <Badge
                        overlap="circle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                        badgeContent={<VisibilityIcon fontSize="small" color="inherit" />} >
                        {user.picture !== "false" ? (
                        <Avatar className={classes.small} alt={user.validated ? user.prenom+" "+user.nom : user.email} src={"/images/user/small/"+user.picture}/> ) : ( 
                        <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                    </Badge>} />
                ))) : (
                <li><ListItem>
                  <ListItemIcon>
                  <Badge
                    overlap="rectangle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                    badgeContent={<EmailIcon fontSize="small" color="inherit" />} >
                    {user.picture !== "false" ? (
                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/user/small/"+user.picture}/> ) : ( 
                    <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                  </Badge>
                  </ListItemIcon>
                  <ListItemText primary={user.email} />
                </ListItem></li>
                )}
              </div>
            ))}
          </Collapse>
          <ListItem button onClick={handleOpenFriends}>
            <ListItemText primary={openMenu ? (openFriends ? "Voir moins" : "Voir plus") : (openFriends ? "-" : "+")} />
            {openFriends ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </div>
      ) : (
        <div>
          {friends.map((user) => (
             <div>
              {user.validated ? (
                (isRequested(user) ? (
                  <ListItemLink to={"/Users/"+user._id} primary={user.validated ? user.prenom+" "+user.nom : user.email } key={user._id}
                  icon={user.picture !== "false" ? (
                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/user/small/"+user.picture}/> ) : ( 
                    <Avatar className={classes.small}><AccountCircle/></Avatar>)} />
                ) : (
                  <ListItemLink to={"/Users/"+user._id} primary={user.validated ? user.prenom+" "+user.nom : user.email } key={user._id}
                    icon={
                      <Badge
                        overlap="circle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                        badgeContent={<VisibilityIcon fontSize="small" color="inherit" />} >
                        {user.picture !== "false" ? (
                        <Avatar className={classes.small} alt={user.validated ? user.prenom+" "+user.nom : user.email} src={"/images/user/small/"+user.picture}/> ) : ( 
                        <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                    </Badge>} />
                ))) : (
                <li><ListItem>
                  <ListItemIcon>
                  <Badge
                    overlap="rectangle" anchorOrigin={{vertical:"top", horizontal:"right"}}
                    badgeContent={<EmailIcon fontSize="small" color="inherit" />} >
                    {user.picture !== "false" ? (
                    <Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/user/small/"+user.picture}/> ) : ( 
                    <Avatar className={classes.small}><AccountCircle/></Avatar>)}
                  </Badge>
                  </ListItemIcon>
                  <ListItemText primary={user.email} />
                </ListItem></li>
              )}
            </div>
          ))}
        </div>
      )}
      <Divider />
      <ListItemLink to="/Album/Create" primary="Créer un nouvel album" icon={<Avatar className={classNames(classes.orange, classes.small)}><AddAPhotoIcon fontSize="small" /></Avatar>} key="addAlbum" />
      {albums.length > 5 ? (
        <div>
          {albums.slice(0,5).map((album) => {
            const photo = album.photos[Math.floor(Math.random() * album.photos.length)];
            return (
              <ListItemLink to={"/Album/"+album._id} primary={album.name} key={album._id}
                icon={<Avatar className={classes.small} alt={album.name} src={"/images/photos/small/"+photo.src}/>}
              />
            )
          })}

          <Collapse in={openAlbums} timeout="auto" unmountOnExit>
            {albums.slice(5).map((album) => {
              const photo = album.photos[Math.floor(Math.random() * album.photos.length)];
              return (
                <ListItemLink to={"/Album/"+album._id} primary={album.name} key={album._id}
                  icon={<Avatar className={classes.small} alt={album.name} src={"/images/photos/small/"+photo.src}/>}
                />
              )
            })}
          </Collapse>
          <ListItem button onClick={handleOpenAlbums}>
            <ListItemText primary={openMenu ? (openAlbums ? "Voir moins" : "Voir plus") : (openAlbums ? "-" : "+")} />
            {openAlbums ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </div>
        ) : (
        <div>
          {albums.map((album) => {
            const photo = album.photos[Math.floor(Math.random() * album.photos.length)];
            return (
              <ListItemLink to={"/Album/"+album._id} primary={album.name} key={album._id}
                icon={<Avatar className={classes.small} alt={album.name} src={"/images/photos/small/"+photo.src}/>}
              />
            )
          })}
        </div>
        )}
    </React.Fragment>
  );
  
  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenuOpen = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoading = (event) => {
    console.log(event.currentTarget);
    setLoading(event.currentTarget);
  }

  const toggleDrawer = (event) => {
    event.preventDefault();
    setOpenMenu(!openMenu)
  }

  const handlePictures = (event) => {
    event.preventDefault();
    setAnchorEl(null);
    let file = event.target.files[0];
    setLoading(true);
    userService.upload(file).then(rep => {
      let str = rep.data.path.split("/");
      let pict = str[str.length-1];
      userService.updatePicture(pict).then(rep => {
        window.location.reload();
      }, err => {
        setLoading(false);
        if(err.response.status>400 && err.response.status<500)
          toastr.warning(err.response.data, "Erreur " + err.response.status);
        else
          toastr.error(err.response.data, "Erreur " + err.response.status);
      })
    }, err => {
      setLoading(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    });
  }

  const history = useHistory();

  const handleDeconnexion = (event) => {
    event.preventDefault();
    setAnchorEl(null);
    setLoading(true);
    userService.logout().then(rep => {
      setAuth(false);
      setProfile(null);
      setLoading(false);
      history.push("/");
    }, err => {
      setLoading(false);
      if(err.response.status>400 && err.response.status<500)
        toastr.warning(err.response.data, "Erreur " + err.response.status);
      else
        toastr.error(err.response.data, "Erreur " + err.response.status);
    })
  }

  return (
    <div>
        <CssBaseline />
        {/* <FormGroup>
          <FormControlLabel
            control={<Choice checked={auth} onChange={handleChange} aria-label="login switch" />}
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup> */}
        <BrowserRouter onChange={handleLoading}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
          {auth && (
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
            <RouterLink to="/" style={{ color:"inherit", textDecoration:"none" }} className={classes.title}>
              <Typography component="h1" variant="h6" color="inherit" noWrap>
                𝐏𝐚𝐫𝐭𝐚𝐠𝐞 𝐝'𝐚𝐥𝐛𝐮𝐦 𝐩𝐡𝐨𝐭𝐨
              </Typography>
            </RouterLink>
            {auth ? (
              <div>
                <input
                  accept="image/*"
                  className={classes.dNone}
                  id="contained-button-file"
                  type="file"
                  onChange={handlePictures}
                />
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                >
                  {profile.picture !== "false" ? (
                  <Avatar alt={profile.prenom+" "+profile.nom} src={"/images/users/small/"+profile.picture} />
                  ) : (<Avatar><AccountCircle fontSize="large"/></Avatar>)}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={openMenuProfile}
                  onClose={handleMenuClose}
                >
                  <label htmlFor="contained-button-file">
                    <MenuItem>
                      <ListItemIcon>
                        <PhotoCamera fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit">Changer de photos</Typography>
                    </MenuItem>
                  </label>
                  <Divider />
                  <MenuItem onClick={handleDeconnexion}>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Déconnexion</Typography>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <RouterLink to="/SignIn" >
                <Button variant="contained" color="primary" size="small" startIcon={<LockOpenIcon />}>Connection</Button>
              </RouterLink>
            )}
          </Toolbar>
        </AppBar>
        <div className={classes.root}>
        {auth && (
          <Drawer
              variant="permanent"
              classes={{
                paper: clsx(classes.drawerPaper, !openMenu && classes.drawerPaperClose),
              }}
              anchor="left"
              open={openMenu}
              // onOpen={toggleDrawer}
              // onClose={toggleDrawer}
            >
              {list({friends:profile.friends, albums:profile.albums})}
            </Drawer>
        )}
        
          <main className={classes.content}>
            {/* <div className={classes.appBarSpacer} /> */}
                {loading ? (
                  <Backdrop className={classes.backdrop} open={openBackdrop}>
                    <CircularProgress color="inherit" />
                  </Backdrop>
                ) : (
                <Switch>
                  <Route exact path = "/" component = {auth ? () => <Dashboard profile={profile} /> : () => <Homepage setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/invitation/:invitId" component = {auth ? () => <Dashboard profile={profile} /> : () => <Homepage setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/verification/:userId" component = {auth ? () => <Dashboard profile={profile} /> : () => <Homepage setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/SignIn" component = {() => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/SignUp" component = {() => <SignUp setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  
                  <Route exact path = "/Album/Create" component = {auth ? () => <AlbumCreate profile={profile} setProfile={setProfile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/Album/Me" component = {auth ? () => <AlbumMe auth={auth} profile={profile} setProfile={setProfile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} />} />
                  <Route exact path = "/Album/Find" component = {auth ? () => <AlbumFind auth={auth} profile={profile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} />} />
                  <Route exact path = "/Album/Tag/:tag" component = {auth ? () => <AlbumTags auth={auth} profile={profile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} />} />
                  <Route exact path = "/Album/:id" component = {auth ? () => <AlbumGet /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/Photos/:id" component ={auth ? () => <Photos profile={profile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  
                  <Route exact path = "/Users/Add" component ={auth ? () => <UserAdd profile={profile} setProfile={setProfile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/Users/Me" component ={auth ? () => <UserMe profile={profile} setProfile={setProfile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/Users/Friends" component ={auth ? () => <UserFriends profile={profile} setProfile={setProfile} newRequest={newRequest} setNewRequest={setNewRequest} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/Users/:id" component ={auth ? () => <UserGet profile={profile} setProfile={setProfile} /> : () => <SignIn setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                
                  <Route exact path = "/ForgotPassword" component ={() => <ForgotPassword setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                  <Route exact path = "/ChangePassword/:token" component ={() => <ChangePassword setAuth={setAuth} auth={auth} setProfile={setProfile} profile={profile} />} />
                </Switch>
              )}
          </main>
        </div>
        </BrowserRouter>
{/*        <footer>
          <Box mt={5}>
            <Copyright />
          </Box>
        </footer>*/}
    </div>
  );
}

export default App;
