import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { createWorker } from 'tesseract.js';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { CopyAll } from '@mui/icons-material';
import CopyToClipboard from 'react-copy-to-clipboard';
registerPlugin(FilePondPluginImagePreview);

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0rem 5rem 0rem',
    minHeight: '70vh',
    background: 'linear-gradient(90deg, rgba(2,142,253,0.9892157546612395) 20%, rgba(0,191,179,1) 85%)',

  },
  title: {
    color: '#fff',
  },
  cardBG: {
    backgroundColor: '#0ee5ff !important',
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
    height: 48,
    padding: '0 30px',
    transform: '0.5s',
    marginBottom: '2',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      fontWeight: '600'
    },
  },
  imagePre: {
    width: '400px',
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
  textAreaBorder:{
    color: '#fff',
    paddingTop: '2rem',
    border: '1px solid #000',
    borderTop: 'none',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  }


});


function ImageTextExtractor() {
  const classes = useStyles();
  const [text, setText] = useState('Copy');
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [percentage, setPercentage] = useState('');
  const [message, setMessage] = useState('');

  const handleFile = async (fileItems) => {
    if (fileItems.length > 0) {
      const imageFile = fileItems[0].file;

      setIsProcessing(true);
      setPercentage(0);

      try {
        const worker = await createWorker({
          logger: (info) => {
            if (info.status === 'recognizing text') {
              const progress = parseInt((info.progress * 100).toFixed(2));
              setPercentage(progress);
            }
          },
        });
        await worker.load();
        await worker.loadLanguage('urd+eng');
        await worker.initialize('urd+eng');
        const { data: {text} } = await worker.recognize(imageFile);
        setOcrText(text);
        await worker.terminate();
      } catch (error) {
        console.error(error);
      }
    } else {
      setOcrText('');
      setIsProcessing(false);
    }
  };


  useEffect(() => {
    if (isProcessing) {
      setMessage(`Please wait, working on it.... (${percentage}%)`);
      if (percentage === 100) {
        setMessage('Text Analyzed');
      }
    } else {
      setMessage('No Valid Text Found / Upload Image to OCR From Image');
    }
  }, [isProcessing, percentage]);


  return (
    <>
      <Box padding={8} minHeight={505} textAlign={'center'}>
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid item xs={6} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Card className={classes.cardBG} sx={{ width: 345, maxWidth: 345 }}>
              <CardHeader title={' Image Text Extraction '} />
              <CardContent>
                <FilePond
                  allowImagePreview
                  allowMultiple={false}
                  onupdatefiles={handleFile}
                  acceptedFileTypes={['image/*']}
                />
                <Typography variant="body1" className={classes.cardText}>
                  {message && message}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {ocrText && (
          <Grid container spacing={2} padding={4} justifyContent={'center'} textAlign={'center'}>
            <Grid item xs={10}>
              <Box>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6} textAlign={'left'}>
                    <Typography variant='h4' className={classes.textHeader} >Analyzed Text:</Typography>
                  </Grid>
                  <Grid item xs={12} md={6} textAlign={'right'}>
                    <Box className={classes.textHeaderCopy}>
                    <CopyToClipboard text={ocrText} onCopy={() => setText("Copied")} >
                      <Button
                      className={'btn-copy'}
                      fontSize={'17px'}
                        disabled={ocrText === "" ? true : false}
                        onClick={() => {
                          setTimeout(() => { setText("Copy") }, 2000)
                        }}
                      >
                        <CopyAll /> {text}
                      </Button>
                    </CopyToClipboard>
                    </Box>

                  </Grid>
                </Grid>

                <Box className={classes.textAreaBorder}>
                  <Typography variant="body1">{ocrText}</Typography>
                </Box>

              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </ >
  );
}

export default ImageTextExtractor;
