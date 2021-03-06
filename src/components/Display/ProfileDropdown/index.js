/* Justin Edwards
 * 09/17/2020
 * ProfileDropdown Component - dropdown displayed when user 
 * clicks on profile image/icon in right of NavBar. Handles
 * sign out and links to profile page (eventually)
 */

import React from 'react';
import {
    Divider, Button, Typography, Paper,
    withStyles } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import * as Firestore from '../../Firestore';
import { useAuthDataContext } from '../../AuthDataProvider';

const styles = {
    mainCard: {
        backgroundColor: "white",
        height: "auto",
        padding: 20,
        width: "auto",
        position: "absolute",
        top: 64,
        right: 2,
        textAlign: "center",
        zIndex: 1
    },
    icon: {
        fontSize: 40,
        marginRight: 10,
        color: "#3e3b3b"
    },
    headTitle: {
        fontFamily: "Inter",
        fontWeight: 800
    },
    divider: {
        marginTop: 10,
        marginBottom: 10
    }
}

function NavBar(props) {

    const { classes } = props;
    const { user, onLogout } = useAuthDataContext();
    
    // handles signing out both in firestore and auth provider
    function handleSignOut() {
        Firestore.signOutUser();
        onLogout();
    }

    return (
        <Paper className={classes.mainCard} position="static" elevation={1}>
                <Person />
                <Divider className={classes.divider}/>
                <Typography>{user.firstName}</Typography>
                <Typography>{user.lastName}</Typography>
                <Divider className={classes.divider}/>
                <Typography>{user.email}</Typography>
                <Divider className={classes.divider}/>
                <Button onClick={handleSignOut}>Sign Out</Button>
        </Paper>
    );
}

export default withStyles(styles)(NavBar);