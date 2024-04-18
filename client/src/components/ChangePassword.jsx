import React from 'react';
import {useParams} from "react-router-dom";

import { useHistory, useLocation } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import userService from '../services/users.js';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ForgotPassword(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  let { token } = useParams();

  const [state, setState] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordInvalid, setPasswordInvalid] = React.useState(false);

  if(props.auth)
    history.push("/");

  const handleSubmit = (event) => {

    event.preventDefault();

    if(!password)
      setPasswordInvalid(true);
    else{
      setPasswordInvalid(false);
      setState(true);
      userService.changePassword(token, password).then(rep => {
        // localStorage.setItem("token", rep.data.token);
        // localStorage.setItem("user", rep.data.user);
        setState(false);
        props.setProfile(rep.data.user);
        props.setAuth(true);
        toastr.success("Votre mot de passe a bien été modifier.", "Mot de passe")
        if(location.pathname !== "/ChangePassword" && location.pathname !== "/")
          history.push(location.pathname);
        else
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

/*  const handleSetEmail = (event) => {
    const email = event.target.value;
    setEmail(email);
    if (/^[a-zA-Z0-9,.'-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email))
      setEmailInvalid(false);
    else
      setEmailInvalid(true);
  };*/

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Changement de mot de passe
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
{/*            <Grid item xs={12}>
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
            </Grid>*/}
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
    {/*          <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />*/}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {state ? (<CircularProgress color="inherit" />) : "Changer de mot de passe"}
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            {/* <Grid item xs>
              <Link href="/ForgotPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link to="/SignUp" className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-body2 MuiTypography-colorPrimary">
                {"Vous n'avez pas de compte ? Enregistrer vous"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}