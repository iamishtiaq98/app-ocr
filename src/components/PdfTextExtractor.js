import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid, Typography, Card, CardHeader, CardContent } from '@mui/material';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyAll } from '@mui/icons-material';
import './PdfTextExtractor.css'



function PdfTextExtractor() {

  const [text, setText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [key, setKey] = useState(0)
  const [copytext, setCopyText] = useState('Copy');
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    setInputValue(e.target.files[0]);
    if (e.target.files[0].type !== 'application/pdf') {
      setFileError('Please select a PDF file.');
    } else {
      setFileError('');
    }
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
        const url = 'https://api-ocr.vercel.app/extract-pdf';
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
        if (data.message === "success") {
          setText(data.text);
          setDownloadUrl(createDownloadUrl(data.text));
        } else if (data.message === "error") {
          setFileError(`Error:  ${data.text}`);
        }

      } catch (error) {
        console.error('Error extracting text from PDF:', error);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleReset = () => {
    setInputValue(Date.now());
    setFileError('');
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
    <Box padding={8} className='pdfroot'>

      <Box className='box1'>
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid item xs={6} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Card className='cardBG' sx={{ textAlign: 'center', width: 345, maxWidth: 345 }}>
              <CardHeader title={' PDF Text Extraction '} />
              <CardContent>
                <Box>
                  {fileError && <Typography className="error">{fileError}</Typography>}
                </Box>
                <TextField
                  className='input'
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  key={key}
                />
              </CardContent>
              <CardContent style={{ display: 'flex', justifyContent: 'space-between' }} >
                <Button className='btnReset' variant="contained" onClick={handleReset} >Reset</Button>
                <Button className='btnExtract' variant="contained" onClick={handleExtract} >Extract</Button>
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
        <Box marginTop={'2rem'}>
          <Card className='mui-card-c'>
            <CardHeader
              title=" Extracted Text"
              action={
                <>
                  <Button className='btn' onClick={handleDownload}>Save Text</Button>
                  <CopyToClipboard text={text} onCopy={() => setCopyText("Copied")} >
                    <Button
                      className='btn-copy'
                      fontSize={'17px'}
                      disabled={text === "" ? true : false}
                      onClick={() => {
                        setTimeout(() => { setCopyText("Copy") }, 2000)
                      }}
                    >
                      <CopyAll /> {copytext}
                    </Button>
                  </CopyToClipboard>
                </>
              }
            />
            <CardContent>
              <Box className='textAreaBorder'>
                <Typography variant="body1">{text}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )
      }
    </Box >
  );
}

export default PdfTextExtractor;