import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
// import DateFnsUtils from '@date-io/date-fns';
// import {KeyboardDatePicker} from '@material-ui/pickers';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';

import { Scrollbars } from 'react-custom-scrollbars';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChipInput from 'material-ui-chip-input'

import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VisibilityIcon from '@material-ui/icons/Visibility';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import photosService from '../../services/photos';
import albumsService from '../../services/albums';

const classNames = require("classnames");

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    boxInput_dashed: {
    	margin:theme.spacing(20),
    	marginTop:theme.spacing(5),
    	marginBottom:theme.spacing(3),
    	padding:theme.spacing(20),
    	border:'2px dashed #CCC',
    },
    boxInput_dashed_2: {
    	margin:theme.spacing(20),
    	marginTop:theme.spacing(5),
    	marginBottom:theme.spacing(3),
    	padding:theme.spacing(3),
    	// paddingTop:theme.spacing(3),
    	// paddingBottom:theme.spacing(3),
    	border:'2px dashed #CCC',
    },
    boxInput: {
    	margin:theme.spacing(20),
    	marginTop:theme.spacing(5),
    	marginBottom:theme.spacing(3),
    	padding:theme.spacing(20),
    	paddingTop:theme.spacing(0),
    	paddingBottom:theme.spacing(5),
    },
    boxInput_end: {
    	margin:theme.spacing(20),
    	marginTop:theme.spacing(5),
    	marginBottom:theme.spacing(3),
    	padding:theme.spacing(20),
    	paddingTop:theme.spacing(5),
    	paddingBottom:theme.spacing(5),
    },
    boxInput_end_button: {
    	marginTop:theme.spacing(10),
    },
    btnSteps: {
    	// marginLeft:theme.spacing(20),
    	marginTop:theme.spacing(5),
    	paddingRight:theme.spacing(30),
    },
    stepper: {
    	marginLeft:theme.spacing(15),
    	marginRight:theme.spacing(15),
    },
    input: {
		display: 'none',
	},
	inputTag: {
		width:"80%",
	},
	inputDate: {
		width:"15%",
	},
	button: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
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
    	cursor: 'pointer',
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
}));


function getSteps(){
	return ['Transfert des photos', 'Informations sur l\'album', 'Restriction d\'amis', 'Sauvegarde'];
}


export default function (props) {
	const classes = useStyles();
	const history = useHistory();

	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const [selectedDate, setSelectedDate] = React.useState(new Date(Date.now()).toISOString().split('T')[0]);
	const [selectedDateError, setSelectedDateError] = React.useState(false);
	const steps = getSteps();

	const [submit, setSubmit] = React.useState(false);
	const [btnNext, setBtnNext] = React.useState(true);
	const [btnPrev, setBtnPrev] = React.useState(false);

	const [title, setTitle] = React.useState("");
	const [titleError, setTitleError] = React.useState(false);
	const [description, setDescription] = React.useState("");
	const [usersBanned, setUsersBanned] = React.useState([]);
	const [tags, setTags] = React.useState([]);
	const [pictures, setPictures] = React.useState([]);
	// const [picturesError, setPicturesError] = React.useState(false);
	const [previews, setPreviews] = React.useState([]);

	const handleSubmit = (event) => {
		event.preventDefault();
		setBtnPrev(true);
		setSubmit(true);

		// console.log(title, description, tags, selectedDate)
		// console.log(pictures);

		photosService.upload(pictures).then(rep => {
			let photos = rep.data.map(p => {
				let str = p.path.split("/");
				return str[str.length-1];
			});

			albumsService.ajout(title, description, selectedDate, tags, usersBanned, photos).then(rep => {
				setSubmit(false);
				setBtnPrev(false);
				let p = {...props.profile};
				p.albums.push(rep.data);
				props.setProfile(p);
				history.push("/Album/"+rep.data._id);
			}, err => {
				setSubmit(false);
				setBtnPrev(false);
				if(err.response.status>400 && err.response.status<500)
		          toastr.warning(err.response.data, "Erreur " + err.response.status);
		        else
		          toastr.error(err.response.data, "Erreur " + err.response.status);
			});
		}, err => {
			setSubmit(false);
			setBtnPrev(false);
			if(err.response.status>400 && err.response.status<500)
	          toastr.warning(err.response.data, "Erreur " + err.response.status);
	        else
	          toastr.error(err.response.data, "Erreur " + err.response.status);
		})
	}

	const handleTitle = (event) => {
		setTitle(event.target.value);
		if(!event.target.value)
			setTitleError(true);
		else
			setTitleError(false);
		if(title && selectedDate)
			setBtnNext(false);
		else
			setBtnNext(true);
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

	const handleAddBanned = (event, user) => {
		const users = [...usersBanned];
		users.push(user._id);
		user.banned = true;
		setUsersBanned(users);
	}

	const handleDelBanned = (event, user) => {
		const users = [...usersBanned];
		const pos = users.indexOf(user._id);
		if(pos !== -1){
			user.banned = false;
			users.splice(pos, 1);
			setUsersBanned(users);
		}
	}

	const handleDate = (event) => {
		setSelectedDate(event.target.value);
		if(!event.target.value)
			setSelectedDateError(true);
		else
			setSelectedDateError(false);

		if(title && selectedDate)
			setBtnNext(false);
		else
			setBtnNext(true);
	}

	const handlePictures = (event) => {
		let files = event.target.files;
		let picts = [...pictures];
		for (let i = 0; i < files.length; i++)
			picts.push(files[i]);
		setPreviews(picts.map((p) => {return URL.createObjectURL(p);}));
		setPictures(picts);
		setBtnNext(false);
	}



	const isStepOptional = (step) => {
		return false;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
		if(activeStep===0){
			if(title && selectedDate)
				setBtnNext(false);
			else
				setBtnNext(true);
		}else
			setBtnNext(false);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
		if(activeStep===1){
			if(pictures.length>0)
				setBtnNext(false);
			else
				setBtnNext(true);
		}
		if(activeStep===2){
			if(title && selectedDate)
				setBtnNext(false);
			else
				setBtnNext(true);
		}
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setTitle("");
		setDescription("");
		setTags("");
		setUsersBanned([]);
		setSelectedDate(new Date("now"));
		setPictures([])
		setActiveStep(0);
	};


	const isRequested = (user) => {
		let pos = props.profile.friendRequests_send.map(r => r.to._id).indexOf(user._id);
		let request = props.profile.friendRequests_send[pos];
		if(request.vue)
			return request.accepted;
		return request.vue;
	};

	return (
		<Container className={classes.cardGrid} maxWidth={false}>
			<Stepper activeStep={activeStep} className={classes.stepper} >
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepOptional(index)) {
						labelProps.optional = <Typography variant="caption">Optional</Typography>;
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<div>
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed - you&apos;re finished
						</Typography>
						<Button onClick={handleReset} className={classes.button}>
							Reset
						</Button>
					</div>
				) : (
					<div>
						{activeStep === 0 && (
							<React.Fragment>
								<input
									accept="image/*"
									className={classes.input}
									id="contained-button-multiple-files"
									multiple
									type="file"
									onChange={handlePictures}
								/>
								{previews.length > 0 ? (
								<Box display="block" justifyContent="center" m={1} p={1} bgcolor="background.paper" className={classes.boxInput_dashed_2}>
									<Grid container spacing={3} justify='center' alignItems='center' alignContent='center'>
										<Grid item xs={12} container justify='center' alignItems='center' alignContent='center'>
											<label htmlFor="contained-button-multiple-files">
												<Button component="span">
													Ajouter d'autres photos
												</Button>
											</label>
										</Grid>
										<Grid item xs={12}>
											<Scrollbars autoHide style={{ height: 220 }}>
			                                    <GridList cellHeight={200} cols={3}>
			                                        {previews.map((photo) => (
			                                            <GridListTile key={photo} cols={1}>
			                                                <img src={photo} alt={photo} />
			                                            </GridListTile>
			                                        ))}
			                                    </GridList>
			                                </Scrollbars>
			                            </Grid>
			                        </Grid>
								</Box>
								) : (
								<Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper" className={classes.boxInput_dashed}>
									<label htmlFor="contained-button-multiple-files">
										<Button component="span">
											Cliquer ici pour télécharger vos photos.
										</Button>
									</label>
								</Box>
								)}
							</React.Fragment>
						)}
						{activeStep === 1 && (
							<Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper" className={classes.boxInput}>
								<form className={classes.form} noValidate>
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

								</form>
							</Box>
						)}
						{activeStep === 2 && (
							<Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper" className={classes.boxInput}>
							{props.profile.friends.length === 0 ? (
				                <Typography variant="body2" color="textSecondary" align="center">Aucuns amis à restreindre</Typography>
				            ) : (
								<Grid container spacing={4} className={classes.gridContent}>
				                    {props.profile.friends.map((user) => (
				                      <Grid item key={user._id} >
				                        <Card className={classes.cardFriend} 
				                        	style={user.banned ? {backgroundColor:"#3f51b5"} : {borderColor:"#3f51b5", borderSize:2}}
				                        	onClick={user.banned ? (event) => handleDelBanned(event, user) : (event) => handleAddBanned(event, user)}>
				                          <CardHeader
				                            avatar={
{/*				                              user.validated ? (
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
				                              )*/}
				                              (user.picture !== "false" ? (
				                              	<Avatar className={classes.small} alt={user.prenom+" "+user.nom} src={"/images/users/small/"+user.picture}/> ) : ( 
				                                <Avatar className={classes.small}><AccountCircle/></Avatar>))

				                            }

				                            title={<Typography variant="body2" displayInline>{user.validated ? (user.prenom+" "+user.nom) : (user.email)}</Typography>}
				                            subheader={user.validated ? "Enregistrer" : "Non enregistrer"}
				                          />
				                        </Card>
				                      </Grid>
				                    ))}
				                </Grid>
						)}
							</Box>)}
						{activeStep === 3 && (
							<Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper" className={classes.boxInput_end}>
								<Grid container spacing={10}>
									<Grid item key="myAlbum" xs={12} sm={6}>
										<Card className={classes.card}>
											<CardHeader 
		                                        avatar={
		                                        	props.profile.picture !== "false" ? (
		                                            	<Avatar alt={props.profile.prenom+" "+props.profile.nom} src={"/images/users/small/"+props.profile.picture} />
		                                            ) : (
		                                            	<Avatar><AccountCircle fontSize="large"/></Avatar>
		                                            )
		                                        }
		                                        title={props.profile.prenom+" "+props.profile.nom}
		                                        subheader={selectedDate}
		                                    />
		                                    <CardContent className={classNames(classes.cardContent, classes.gridContent)}>
		                                        <Scrollbars autoHide autoHeight>
		                                            <GridList cellHeight={150}>
		                                                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
		                                                    <ListSubheader component="div">{title}</ListSubheader>
		                                                </GridListTile>
		                                                {previews.map((photo) => (
		                                                    <GridListTile key={photo}>
		                                                        <img src={photo} alt={photo} />
		                                                    </GridListTile>
		                                                ))}
		                                            </GridList>
		                                        </Scrollbars>
		                                    </CardContent>
		                                </Card>
		                            </Grid>

		                            <Grid item key="myAlbumForm" xs={12} sm={6}>
		                            	<form className={classes.form} noValidate onSubmit={handleSubmit}>
		                            		<Button
												type="submit"
												fullWidth
												variant="contained"
												color="primary"
												size="large"
												className={classes.boxInput_end_button}
											>
											{submit ? (<CircularProgress color="inherit" />) : "Enregistrer l'album"}
											</Button>
										</form>
		                            </Grid>
		                        </Grid>
							</Box>
						)}
						<Grid container className={classes.btnSteps} justify="flex-end" direction="row" alignItems="center" spacing={10}>
							<Button disabled={activeStep === 0 || btnPrev} onClick={handleBack} className={classes.button}>
								Précédent
							</Button>
							{isStepOptional(activeStep) && (
								<Button
				                  variant="contained"
				                  color="primary"
				                  onClick={handleSkip}
				                  disabled={submit}
				                  className={classes.button}
				                >
				                	skip
				                </Button>
				            )}
				            <Button
								variant="contained"
								color="primary"
								disabled={btnNext || activeStep === steps.length - 1}
								onClick={handleNext}
								className={classes.button}
							>
								{activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
							</Button>
						</Grid>
					</div>
				)}

			</div>

		</Container>
	);
};