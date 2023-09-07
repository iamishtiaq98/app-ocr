import React, { useState } from 'react';
function PdfTextExtractor() {

  const [text, setText] = useState('');

 const handleFileChange = async (event) => {
  const selectedFile = event.target.files[0];

  if (!selectedFile) {
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    const arrayBuffer = reader.result;
    const pdfData = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    console.log('PDF Data on Client:', pdfData);
    
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
      console.log('PDF Data on Server:', data.text);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  };

  reader.readAsArrayBuffer(selectedFile);
};

  

  return (
    <div>
      <h1>PDF Text Extraction</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <div>
        <h2>Extracted Text:</h2>
        <pre>{text}</pre>
      </div>
    </div>
  );
}

export default PdfTextExtractor;
