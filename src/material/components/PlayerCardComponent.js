import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {CircularProgressComponent} from "material/components/CircularProgressComponent";
import Grid from "@material-ui/core/Grid";
import {PointsChipComponent} from "./PointsChipComponent";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import {actions} from "../../store/actions";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(() => ({
    container: {
        padding: "2rem",
        textAlign: "center",
        overflow: "hidden",
        whiteSpace: "nowrap"
    },
    name: {
        marginBottom: "1rem",
        cursor: "pointer"
    },
    deleteButton: {
        display: "flex",
        justifyContent: "flex-end"
    }
}));

export const PlayerCardComponent = ({playerData}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    
    const nameFieldRef = useRef(null);

    const currentPoints = playerData.points.reduce((a, b) => a + b, 0);
    const pointLimit = useSelector(state => state.gameData.maxPoints);
    const [isEditingName, setIsEditingName] = useState(false);

    const removePlayer = () => {
        dispatch({
            type: actions.player.REMOVE_PLAYER,
            data: {id: playerData.id}
        });
    };

    const renamePlayer = (newName) => {
        setIsEditingName(false);

        if (newName !== "") dispatch({
            type: actions.player.RENAME_PLAYER,
            data: {id: playerData.id, name: newName}
        });
    }
    
    useEffect(() => {
        if(isEditingName) {
            nameFieldRef.current.focus();
        }
    }, [isEditingName])

    return (
        <Grid item sm={6} md={4}>
            <Paper elevation={3}>
                <div className={classes.container}>
                    {isEditingName ?
                        <TextField
                            variant={"standard"}
                            inputRef={nameFieldRef}
                            label={"name"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onBlur={(event) => {
                                renamePlayer(event.target.value)
                            }}
                        />
                        :
                        <Tooltip title={<Typography variant={"body2"}>Click to change name</Typography>}>
                            <Typography variant={"h4"} 
                                        className={classes.name}
                                        onClick={() => {
                                setIsEditingName(true);
                            }}>
                                {playerData.name}
                            </Typography>
                        </Tooltip>}
                        <CircularProgressComponent percent={(currentPoints / pointLimit) * 100} points={currentPoints}/>
                    {playerData.points.map((point, key) => {
                        return (
                        <PointsChipComponent key={key} points={point}/>
                        )
                    })}
                        </div>
                        <div className={classes.deleteButton}>
                        <IconButton aria-label="delete" className={classes.margin} onClick={removePlayer}>
                        <DeleteIcon fontSize="small"/>
                        </IconButton>
                        </div>
                        </Paper>
                        </Grid>
                        );
                        };

                        PlayerCardComponent.propTypes = {
                        playerData: PropTypes.object.isRequired
                        }
