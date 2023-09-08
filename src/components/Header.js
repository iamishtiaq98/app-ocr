import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import LogoImg from '../fonts/logo.png'
import './Header.css';


const Header = () => {
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isLGScreen = window.innerWidth >= 1280;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <AppBar className='headerRoot' position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={LogoImg} alt="Logo" width="248" height="60" style={{marginLeft: '2rem'}} />
          </Typography>

          {isLGScreen ?
          (
            <>
            <Link style={{ display:{lg:'block'} }} className='navLink' to="/imageconvertor">Image to Text</Link>
            <Link style={{ display:{lg:'block'} }} className='navLink' to="/pdfconvertor">PDF to Text</Link>
          </>
          ) : (
          <Button style={{ display:{lg:'none'} }} className='btn' onClick={toggleDrawer} >
            Menu
          </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer className='drawer1' anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
        <div className='navLinks'>
          <Link className='btn' to="/imageconvertor">Image to Text</Link>
          <Link className='btn' to="/pdfconvertor">PDF to Text</Link>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
