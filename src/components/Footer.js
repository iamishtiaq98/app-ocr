// Footer.js
import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        bottom: '0',
        width: '100%',
        padding: '15px 5px',
        background: 'linear-gradient(90deg, rgba(2,142,253,0.9892157546612395) 20%, rgba(0,191,179,1) 85%)',
        color: '#fff !important',
    },
});

const Footer = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.root} elevation={3}>
            <Typography variant="body2" component="p">
                © {new Date().getFullYear()} IshiCoder.com
            </Typography>
        </Paper>
    );
};

export default Footer;
