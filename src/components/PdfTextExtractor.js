import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { Box, Grid, Typography, Card, CardHeader, CardContent } from '@mui/material';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyAll } from '@mui/icons-material';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0rem 5rem 0rem',
    minHeight: '70vh',

  },
  title: {
    color: '#fff',
  },
  box1: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    height: 'auto !important',
    maxHeight: '30px !important',
    padding: '7.5px 17px !important',
  },
  extractedtext: {
    color: '#fff'
  },
  btn: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    color: '#fff !important',
    height: 36,
    padding: '0 30px',
    transform: '0.5s',
    marginBottom: '2',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 8px 5px 2px rgba(255, 105, 135, .3)',
    },
  },

  btnExtract: {
    background: 'linear-gradient(45deg, #00BABB 30%, #038EFD 90%)',
    border: 0,
    borderRadius: 3,
    color: '#fff !important',
    height: 36,
    padding: '0 30px',
    transform: '0.5s',
    marginBottom: '2',
    '&:hover': {
      background: 'linear-gradient(45deg, #00BABB 30%, #038EFD 90%)',
      boxShadow: '0 8px 5px 2px rgba(255, 105, 135, .3)',
    },
  },
  btnReset: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    color: '#fff !important',
    height: 36,
    padding: '0 30px',
    transform: '0.5s',
    marginBottom: '2',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 8px 5px 2px rgba(255, 105, 135, .3)',
    },
  },
  cardBG: {
    backgroundColor: '#0ee5ff !important',
  },
  textHeader: {
    background: '#2ac3ff',
    color: '#8a000d',
    fontSize: '30px !important',
    padding: '0px 11px',
    borderRadius: '2px',
    lineHeight: '1.5 !important'
  },
  textHeaderCopy: {
    background: '#2ac3ff',
    color: '#8a000d',
    fontSize: '20px !important',
    padding: '3px 11px',
    borderRadius: '2px',
  },
  textAreaBorder: {
    color: '#fff',
    paddingTop: '2rem',
    border: '1px solid #000',
    borderTop: 'none',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  }

});


function PdfTextExtractor() {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [key, setKey] = useState(0)
  const [copytext, setCopyText] = useState('Copy');


  const handleFileChange = (e) => {
    setInputValue(e.target.files[0]);


  }
  const handleExtract = () => {
    const selectedFile = inputValue;
    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const pdfData = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      try {
        const url = 'http://localhost:5000/extract-pdf';
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        };

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ pdfData }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setText(data.text);
        setDownloadUrl(createDownloadUrl(data.text));
      } catch (error) {
        console.error('Error extracting text from PDF:', error);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleReset = () => {
    setInputValue(Date.now());
    setText('');
    setDownloadUrl('');
    setKey(key + 1)
  };

  const createDownloadUrl = (extractedText) => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'extracted_text.txt';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', downloadUrl, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setDownloadProgress(progress);
      }
    };

    xhr.onload = () => {
      setDownloadProgress(100);
      a.click();
    };

    xhr.send();
  };

  return (
    <Box padding={8} className={classes.root}>

      <Box className={classes.box1}>
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid item xs={6} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Card className={classes.cardBG} sx={{ textAlign: 'center', width: 345, maxWidth: 345 }}>
              <CardHeader title={' PDF Text Extraction '} />
              <CardContent>
                <TextField
                  className={classes.input}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  key={key}
                />
              </CardContent>
              <CardContent style={{ display: 'flex', justifyContent: 'space-between' }} >
                <Button className={classes.btnReset} variant="contained" onClick={handleReset} >Reset</Button>
                <Button className={classes.btnExtract} variant="contained" onClick={handleExtract} >Extract</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {extractionProgress > 0 && extractionProgress < 100 && (
        <div>
          <p>Extraction in progress: {extractionProgress.toFixed(2)}%</p>
          <CircularProgress variant="determinate" value={extractionProgress} />
        </div>
      )}

      {downloadProgress > 0 && downloadProgress < 100 && (
        <div>
          <p>Downloading in progress: {downloadProgress.toFixed(2)}%</p>
          <progress value={downloadProgress} max="100"></progress>
        </div>
      )}

      {text && (

        <Grid container spacing={2} padding={4} justifyContent={'center'} textAlign={'center'}>
          <Grid item xs={10}>
            <Box>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6} textAlign={'left'}>
                  <Typography variant='h4' className={classes.textHeader} >Ectracted Text:</Typography>
                </Grid>

                <Grid item xs={12} md={6} textAlign={'right'}>
                  <Box className={classes.textHeaderCopy}>
                    <Button className={classes.btn} onClick={handleDownload}>Download Text</Button>
                    <CopyToClipboard text={text} onCopy={() => setCopyText("Copied")} >

                      <Button
                        className={'btn-copy'}
                        fontSize={'17px'}
                        disabled={text === "" ? true : false}
                        onClick={() => {
                          setTimeout(() => { setCopyText("Copy") }, 2000)
                        }}
                      >
                        <CopyAll /> {copytext}
                      </Button>
                    </CopyToClipboard>
                  </Box>
                </Grid>
              </Grid>
              <Box className={classes.textAreaBorder}>
                <Typography variant="body1">{text}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default PdfTextExtractor;