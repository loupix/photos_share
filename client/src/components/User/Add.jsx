import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import { deepOrange, deepPurple } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import SearchIcon from '@material-ui/icons/Search';

import userService from "../../services/users";
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

	const [loading, setLoading] = React.useState(false);
	const [isEmail, setIsEmail] = React.useState(false);
	const [submit, setSubmit] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [messageEmail, setMessageEmail] = React.useState("");
	const [users, setUsers] = React.useState([]);

	const handleSearch = (event) => {
		event.preventDefault();
		setSearch(event.target.value);
		if(search !== ""){
			userService.find(event.target.value).then(rep =>{
				setUsers(rep.data.users);
				setIsEmail(rep.data.isEmail);
			}, err => {
				if(err.response.status>400 && err.response.status<500)
					toastr.warning(err.response.data, "Erreur " + err.response.status);
				else
					toastr.error(err.response.data, "Erreur " + err.response.status);
			});
		};
	}

	const handleAddFriend = (event, user_id) => {
		event.preventDefault();
		friendService.add(user_id).then(rep => {
			props.setProfile(rep.data.user);
			toastr.success("Demande envoyer", "Succes");
		}, err => {
			if(err.response.status>400 && err.response.status<500)
				toastr.warning(err.response.data, "Erreur " + err.response.status);
			else
				toastr.error(err.response.data, "Erreur " + err.response.status);
		})
	}


	// const handleRequestAdd = (event, user_id) => {
	// 	event.preventDefault();
	// 	requestService.add(user_id).then(rep => {
	// 		props.setProfile(rep.data.user);
	// 		toastr.success("Invitation envoyés", "Succes");
	// 	}, err => {
	// 		if(err.response.status>400 && err.response.status<500)
	// 			toastr.warning(err.response.data, "Erreur " + err.response.status);
	// 		else
	// 			toastr.error(err.response.data, "Erreur " + err.response.status);
	// 	})
	// }


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


	const handleMessageMail = (event) => {
		event.preventDefault();
		setMessageEmail(event.target.value);
	}


	const handleSubmit = (event) => {
		event.preventDefault();
		setSubmit(true);
		friendService.create(search, messageEmail).then(rep => {
			props.setProfile(rep.data.user);
			setSearch("");
			setSubmit(false);
			toastr.success("Invitation envoyer", "Succes");
		}, err => {
			setSubmit(false);
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
		) : (
		<div>
			<Card>
				<CardContent>
					<TextField
		                variant="outlined"
		                required
		                fullWidth
		                autoFocus
		                id="email"
		                label="Rechercher une personne"
		                value={search}
		                onInput={handleSearch}
		                name="email"
		                autoComplete="Email, nom, prenom"
		                InputProps={{
		                	startAdornment: (<InputAdornment position="start"><SearchIcon color="textSecondary" /></InputAdornment>)
		                }}
		            />
		            <Typography variant="body2" color="textSecondary" align="right" style={{paddingTop:6}}>{users.length>0 ? users.length : "Aucuns"} utilisateurs trouvés</Typography>
	            </CardContent>
		    </Card>
		    {users.length === 0 ? (
		    	(isEmail && (
		    		<div className={classes.gridContent}>
		    			<div className={classes.paper}>
		    				<form className={classes.form} noValidate onSubmit={handleSubmit}>
		    					<Grid container spacing={2}>
						            <Grid item xs={12}>
						            	 <TextField
							                variant="outlined"
							                required
							                fullWidth
							                id="email"
							                label="Adresse email"
							                value={search}
							                name="email"
							                autoComplete="Adresse email"
							                disabled={true}
							              />
						            </Grid>
						            <Grid item xs={12}>
						            	 <TextField
							                variant="outlined"
							                required
							                fullWidth
							                id="message"
							                label="Message mail"
							                value={messageEmail}
							                onInput={handleMessageMail}
							                name="message"
							                autoComplete="Message personnaliser"
							                disabled={submit}
							                multiline
											rows={3}
							              />
						            </Grid>
						            <Grid item xs={12}>
						              <Button
						                type="submit"
						                fullWidth
						                variant="contained"
						                color="primary"
						                className={classes.submit}
						              >
						                {submit ? (<CircularProgress color="inherit" />) : "Envoyer l'invitation"}
						              </Button>
						            </Grid>
						        </Grid>
						    </form>
		    			</div>
		    		</div>
		    	))
		    ) : (
		    	<Grid container spacing={4} className={classes.gridContent}>
					{users.map((user) => (
						<Grid item key={user._id} >
							<Card>
								<CardHeader
									avatar={
										<Link to={"/Users/"+user._id} style={{ color:"inherit", textDecoration:"none" }}>
										{user.picture !== "false" ? ( 
											<Avatar alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture} />
										):(
											<Avatar><AccountCircle fontSize="large"/></Avatar>
										)}
										</Link>
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
									{!props.profile.friends.map(u => u._id).includes(user._id) ? (
										(!props.profile.friendRequests_send.map(r => r.to._id).includes(user._id) ? (
											<Button size="small" color="primary" onClick={(event) => handleAddFriend(event, user._id)}>
												Demander comme amis
											</Button>
										) : (
											<Button size="small" color="primary" onClick={(event) => handleDelFriend(event, user._id)}>
												Annuler ma demande d'amis
											</Button>
										))
									) : (
										<Button size="small" color="primary" onClick={(event) => handleDelFriend(event, user._id)}>
										Retirer comme amis
										</Button>
									)}
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</div>
		)}
		</Container>
	)
};