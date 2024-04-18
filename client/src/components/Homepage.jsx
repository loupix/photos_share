import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, Link } from 'react-router-dom'

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';

import userService from '../services/users.js';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop:theme.spacing(1),
      marginBottom:theme.spacing(2),
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
      border: "none",
    },
    cardGrid: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(8),
    },
    inline: {
      display: 'inline',
    },
    submit: {
		margin: theme.spacing(3, 0, 2),
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

function useQuery() {
  return new URLSearchParams(window.location.search);
}

export default function(props){
    const classes = useStyles();
    const { userId, invitId } = useParams();

    const [state, setState] = React.useState(false);
	const [firstName, setFirstName] = React.useState('');
	const [firstNameInvalid, setFirstNameInvalid] = React.useState(false);
	const [lastName, setLastName] = React.useState('');
	const [lastNameInvalid, setLastNameInvalid] = React.useState(false);
	const [email, setEmail] = React.useState('');
	const [emailInvalid, setEmailInvalid] = React.useState(false);
	const [password, setPassword] = React.useState('');
	const [passwordInvalid, setPasswordInvalid] = React.useState(false);

	React.useEffect(() => {
		if(invitId){
			userService.getInvitation(invitId).then(rep => {
				setEmail(rep.data.email);
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
	}, [0]);


    const handleSubmit = (event) => {

		event.preventDefault();

		if(!firstName)
		  setFirstNameInvalid(true);
		else
		  setFirstNameInvalid(false);

		if(!lastName)
		  setLastNameInvalid(true);
		else
		  setLastNameInvalid(false);

		if(!email)
		  setEmailInvalid(true);

		if(!password)
		  setPasswordInvalid(true);
		else
		  setPasswordInvalid(false);

		if(!email || !firstName || !lastName || !email || !password)
		  setState(false);
		else{
		  setState(true);
		  userService.signup(firstName, lastName, email, password).then(rep => {
		    // localStorage.setItem("token", rep.data.token);
		    // localStorage.setItem("user", rep.data.user);
		    setState(false);
		    props.setProfile(rep.data.user);
		    props.setAuth(true);
		  }, err => {
		    setState(false);
		    props.setAuth(false);
		    if(err.response.status>400 && err.response.status<500)
		      toastr.warning(err.response.data, "Erreur " + err.response.status);
		    else
		      toastr.error(err.response.data, "Erreur " + err.response.status);
		  });
		}

	};


	const handleSetEmail = (event) => {
		const email = event.target.value;
		setEmail(email);
		if (/^[a-zA-Z0-9,.'-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email))
		  setEmailInvalid(false);
		else
		  setEmailInvalid(true);
	};

	const handleFirstName = (event) => {
		setFirstName(event.target.value);
		if(!event.target.value)
		  setFirstNameInvalid(true);
		else
		  setFirstNameInvalid(false);
	}

	const handleLastName = (event) => {
		setLastName(event.target.value);
		if(!event.target.value)
		  setLastNameInvalid(true);
		else
		  setLastNameInvalid(false);
	}

	const handlePassword = (event) => {
		setPassword(event.target.value);
		if(!event.target.value)
		  setPasswordInvalid(true);
		else
		  setPasswordInvalid(false);
	}

    return (
        <Container className={classes.cardGrid} maxWidth={false}>
        	<Grid container spacing={4}>
        		<Grid item xs={12} sm={9}>
        			<img src="Accueil_1.png" alt="Accueil" style={{width:"100%"}}/>
        		</Grid>

        		<Grid item xs={12} sm={3} className={classes.gridContent}>
        			<form className={classes.form} noValidate onSubmit={handleSubmit}>
	        			<Grid container spacing={2}>
	        				<Grid item xs={12} sm={6}>
				              <TextField
				                error={firstNameInvalid}
				                autoComplete="Prénom"
				                name="firstName"
				                variant="outlined"
				                required
				                fullWidth
				                id="firstName"
				                label="Prénom"
				                value={firstName}
				                onInput={handleFirstName}
				                disabled={state}
				              />
				            </Grid>
				            <Grid item xs={12} sm={6}>
				              <TextField
				                error={lastNameInvalid}
				                variant="outlined"
				                required
				                fullWidth
				                id="lastName"
				                label="Nom"
				                value={lastName}
				                onInput={handleLastName}
				                name="lastName"
				                autoComplete="Nom de famille"
				                disabled={state}
				              />
				            </Grid>
				            <Grid item xs={12}>
				              <TextField
				                error={emailInvalid}
				                variant="outlined"
				                required
				                fullWidth
				                id="email"
				                label="Adresse email"
				                value={email}
				                onInput={handleSetEmail}
				                name="email"
				                autoComplete="Adresse email"
				                disabled={state}
				              />
				            </Grid>
				            <Grid item xs={12}>
				              <TextField
				                error={passwordInvalid}
				                variant="outlined"
				                required
				                fullWidth
				                name="password"
				                label="Mot de passe"
				                value={password}
				                onInput={handlePassword}
				                type="password"
				                id="password"
				                autoComplete="Mot de passe"
				                disabled={state}
				              />
				            </Grid>
	        			</Grid>
	        			<Button
				            type="submit"
				            fullWidth
				            variant="contained"
				            color="primary"
				            className={classes.submit}
				          >
				            {state ? (<CircularProgress color="inherit" />) : "S'enregistrer"}
				          </Button>
				    </form>
        		</Grid>
        	</Grid>
        	<Grid container spacing={4}>
        		<Grid item xs={12} sm={6}>
		        	<Grid container spacing={4} justify="center" alignItems="center" className={classes.root}>
		        		<Grid item>
		        			<PhotoLibraryIcon fontSize="large" />
		        		</Grid>
		        		<Grid item xs={12} sm={6}>
		        			<Typography variant="h6">
		        				Créer votre propre albums
		        			</Typography>
		        			<Typography variant="body2">
		        				Télécharger en quelques cliques vos photos, ajouter un titre et des tags afin que vos amis puissent les voirs.
		        			</Typography>
		        		</Grid>
		        	</Grid>


		        	<Grid container spacing={4} justify="center" alignItems="center" className={classes.root}>
		        		<Grid item xs={12} sm={6}>
		        			<Typography variant="h6">
		        				Invitez vos amis
		        			</Typography>
		        			<Typography variant="body2">
		        				Rechercher vos amis par email, ou par leur prénom.
		        			</Typography>
		        		</Grid>
		        		<Grid item>
		        			<GroupAddIcon fontSize="large" />
		        		</Grid>
		        	</Grid>


		        	<Grid container spacing={4} justify="center" alignItems="center" className={classes.root}>
		        		<Grid item>
		        			<PersonAddDisabledIcon fontSize="large" />
		        		</Grid>
		        		<Grid item xs={12} sm={6}>
		        			<Typography variant="h6">
		        				Limitez l'acces
		        			</Typography>
		        			<Typography variant="body2">
		        				Vous pourriez ainsi restreindre l'acces de vos photos à cetains de vos amis seulement.
		        			</Typography>
		        		</Grid>
		        	</Grid>
		        </Grid>
		        <Grid item xs={12} sm={6}>
        			<img src="Accueil_2.png" alt="Accueil" style={{width:"100%"}}/>
        		</Grid>
        	</Grid>
        </Container>
    );
}