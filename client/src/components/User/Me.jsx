import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { useParams } from "react-router-dom";

// import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
// import Grid from '@material-ui/core/Grid';

// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardMedia from '@material-ui/core/CardMedia';

// import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import FavoriteIcon from '@material-ui/icons/Favorite';

// import userService from "../../services/users";



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
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
  // let { id } = useParams();

	const [loading, setLoading] = React.useState(true);
	// const [user, setUser] = React.useState([]);

	return (
		<Container className={classes.cardGrid} maxWidth={false}>
		{loading ? (
			<Backdrop className={classes.backdrop} open={true}>
		  <CircularProgress color="inherit" />
		</Backdrop>
		) : (
      <div>Loaded</div>
		)}
    </Container>
	)
};