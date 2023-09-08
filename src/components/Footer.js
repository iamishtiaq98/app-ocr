import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './Footer.css';


const Footer = () => {
    
    return (
        <Paper className='footerRoot' elevation={3}>
            <Typography variant="body2" component="p" className='footerText'>
                © {new Date().getFullYear()} IshiCoder.com
            </Typography>
        </Paper>
    );
};

export default Footer;
