// Justin Edwards
// 08/26/2020
// Single todo list component

import React, { useState, useEffect, useRef } from 'react';

import { Button, Typography, Paper, Divider, Checkbox, TextField,
    IconButton, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle, withStyles } from '@material-ui/core';
import { RadioButtonUnchecked, RadioButtonChecked, 
    DeleteOutlineOutlined, Edit, Done } from '@material-ui/icons';

import * as Firestore from '../Firestore'

const styles = {
    mainContainer: {
        width: "100%",
        minHeight: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    horizontalFlex: {
        display: "flex",
        justifyContent: "space-between"
    },
    leftFlex: {
        display: "flex",
        justifyContent: "space-between",
        flex: 1
    },
    bodyLabel: {
        lineHeight: "20px",
        margin: "auto auto auto 0"
    },
    bodyLabelCompleted: {
        lineHeight: "20px",
        margin: "auto auto auto 0",
        textDecoration: "line-through"
    },
    trashIcon: {
        color: "#e63939"
    },
    todoEdit: {
        margin: "auto",
        width: "100%"
    }
}

function SingleToDo(props) {

    const { classes, id } = props;
    // state hooks
    const [body, setBody] = useState(props.body);
    const [status, setStatus] = useState(props.status);
    const [editing, setEditing] = useState(false);
    const [confirmTrashOpen, setConfirmTrashOpen] = useState(false);
    const isFirstRun = useRef(true);

    // cross off/un-cross off todo item
    function handleIconChange() {
        if (status === "pending") {
            setStatus("completed");
        } else {
            setStatus("pending");
        }
    }

    // toggle editing on a todo
    function toggleEditing() {
        // this checks the value passed in from App.js (editing hook) to
        // see if a todo is already being edited. If so, nothing happens,
        // otherwise the todo edit pressed toggles editing
        if (props.todoEditing) {
            // this checks if the todo pressed is the one already being 
            // edited. If so it leaves edit mode, otherwise it returns
            if (editing) {
                Firestore.updateTodoBody(id, body).then(() => {
                    setEditing(!editing);
                    props.toggleEditing();
                });
            }
            return;
        }
        setEditing(!editing);
        props.toggleEditing();
    }

    // opens delete confirm dialogue
    function trashTodo() {
        setConfirmTrashOpen(true);
    }

    // closes delete confirm dialogue
    function handleTrashClose() {
        setConfirmTrashOpen(false);
    }

    // deletes from db and closes confirm dialogue
    function handleTrashConfirm() {
        Firestore.deleteTodo(id).then(() => {
            setConfirmTrashOpen(false);
            props.refresh();
        })
    }

    function handleEdit(e) {
        setBody(e.target.value);
    }

    // called after status hook changes to update status in db
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        Firestore.updateTodoStatus(id, status);
    }, [id, status])

    return (
        <div>
            <Paper elevation={0} className={classes.mainContainer}>
                <Paper elevation={0} className={classes.horizontalFlex}>
                    <div className={classes.leftFlex}>
                        <Checkbox className={classes.checkbox} icon={<RadioButtonUnchecked />} checkedIcon={<RadioButtonChecked />} 
                        checked={status === "completed"} name="gilad" onChange={handleIconChange}/>
                        {editing ? <TextField autoFocus className={classes.todoEdit} value={body} onChange={handleEdit}
                        InputProps={{
                            className: classes.todoEdit,
                        }}/> : 
                        <Typography className={status === "completed" ? 
                        classes.bodyLabelCompleted : classes.bodyLabel}>{body}</Typography> }
                    </div>
                    <div className={classes.horizontalFlex}>
                        <IconButton color="primary" component="span" className={classes.smallIcon} onClick={toggleEditing}>
                            {editing ? <Done /> : <Edit /> }
                        </IconButton>
                        <IconButton color="primary" component="span" className={classes.trashIcon} onClick={trashTodo}>
                            <DeleteOutlineOutlined />
                        </IconButton>
                    </div>
                    <Dialog
                        open={confirmTrashOpen}
                        keepMounted
                        onClose={handleTrashClose}
                    >
                        <DialogTitle>{"Confirm Delete"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this todo? It will no longer show up
                            as a completed item.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleTrashClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleTrashConfirm} color="primary">
                            Delete
                        </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Paper>
            <Divider />
        </div>
    )
}

export default withStyles(styles)(SingleToDo);