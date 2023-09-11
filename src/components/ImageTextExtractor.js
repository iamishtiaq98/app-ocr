import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { createWorker } from 'tesseract.js';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { CopyAll } from '@mui/icons-material';
import CopyToClipboard from 'react-copy-to-clipboard';
import './ImageTextExtractor.css'

registerPlugin(FilePondPluginImagePreview);



function ImageTextExtractor() {

  const [text, setText] = useState('Copy');
  const [ocrText, setOcrText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [percentage, setPercentage] = useState('');
  const [message, setMessage] = useState('');

  const handleFile = async (fileItems) => {
    if (fileItems.length > 0) {

      const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif']; // Define the accepted image file types
      const fileType = fileItems[0].file.type;

      if (!acceptedFileTypes.includes(fileType)) {
        setMessage('Please select an image file (JPEG, PNG, or GIF).');
      } else {
        setMessage('');
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
          const { data: { text } } = await worker.recognize(imageFile);
          setOcrText(text);
          await worker.terminate();

        } catch (error) {
          console.error(error);
        }
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
            <Card className='cardBG' sx={{ width: 345, maxWidth: 345 }}>
              <CardHeader title={' Image Text Extraction '} />
              <CardContent>
                <FilePond
                  allowImagePreview
                  allowMultiple={false}
                  onupdatefiles={handleFile}
                  acceptedFileTypes={['image/*']}
                />
                <Typography variant="body1" className='cardText'>
                  {message && message}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {ocrText && (

          <Box marginTop={'2rem'}>
            <Card className='mui-card-c'>
              <CardHeader
                title=" Extracted Text"
                action={
                  <>
                    <CopyToClipboard text={ocrText} onCopy={() => setText("Copied")} >
                      <Button
                        className='btn-copy'
                        fontSize={'17px'}
                        disabled={ocrText === "" ? true : false}
                        onClick={() => {
                          setTimeout(() => { setText("Copy") }, 2000)
                        }}
                      >
                        <CopyAll /> {text}
                      </Button>
                    </CopyToClipboard>
                  </>
                }
              />
              <CardContent>
                <Box className='textAreaBorder'>
                  <Typography variant="body1">{ocrText}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

        )}
      </Box>
    </ >
  );
}

export default ImageTextExtractor;
