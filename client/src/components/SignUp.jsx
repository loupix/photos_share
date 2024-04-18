import React from 'react';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import userService from '../services/users.js';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [firstNameInvalid, setFirstNameInvalid] = React.useState(false);
  const [lastName, setLastName] = React.useState('');
  const [lastNameInvalid, setLastNameInvalid] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailInvalid, setEmailInvalid] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordInvalid, setPasswordInvalid] = React.useState(false);

  if(props.auth)
    history.push("/");

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
        history.push("/");
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
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MeetingRoomIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enregistrement
        </Typography>
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
                autoFocus
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
{/*            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>*/}
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
          <Grid container>
{/*            <Grid item xs>
              <Link to="/ForgotPassword" className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-body2 MuiTypography-colorPrimary">
                {"Mot de passe perdu ? Demandez à la modifier"}
              </Link>
            </Grid> */}
            <Grid item>
              <Link to="/SignIn" className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-body2 MuiTypography-colorPrimary">
                Vous avez un compte ? Connectez vous.
              </Link>
              <br />
              <Link to="/ForgotPassword" className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-body2 MuiTypography-colorPrimary">
                {"Mot de passe perdu ? Demandez à le modifier."}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}