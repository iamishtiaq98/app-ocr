import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import LogoImg from '../fonts/logo.png'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(90deg, rgba(2,142,253,0.9892157546612395) 20%, rgba(0,191,179,1) 85%)',
  },
  btn: {
    background: 'linear-gradient(45deg, #2f676c 10%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    color: '#fff !important',
    height: 48,
    paddingTop: '1.2rem',
    transform: '0.5s',
    textAlign: 'center',
    textDecoration: 'none !important',
    marginBottom: '1rem',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem',
  },
  navLink: {
    color: '#fff !important',
    fontSize: '20px !important',
    fontWeight: '600 !important',
    textTransform: 'Uppercase',
    marginRight: '1rem !important',
    textDecoration: 'none !important',
    '&:hover': {
      color: '#3B047D !important',
      cursor: 'pointer !important',
    },
  },

});

const Header = () => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isLGScreen = window.innerWidth >= 1280;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={LogoImg} alt="Logo" width="248" height="60" style={{marginLeft: '2rem'}} />
          </Typography>

         
          {isLGScreen ?
          (
            <>
            <Link style={{ display:{lg:'block'} }} className={classes.navLink} to="/imageconvertor">Image to Text</Link>
            <Link style={{ display:{lg:'block'} }} className={classes.navLink} to="/pdfconvertor">PDF to Text</Link>
          </>
          ) : (
          <Button style={{ display:{lg:'none'} }} className={classes.btn} onClick={toggleDrawer} >
            Menu
          </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer className={classes.drawer1} anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
        <div className={classes.navLinks}>
          <Link className={classes.btn} to="/imageconvertor">Image to Text</Link>
          <Link className={classes.btn} to="/pdfconvertor">PDF to Text</Link>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
