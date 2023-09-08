import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import PdfTextExtractor from './components/PdfTextExtractor';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ImageTextExtractor from './components/ImageTextExtractor';


function App() {
  const classes = useStyles();
  return (
    <div className='Approot App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<PdfTextExtractor />} />
          <Route path='/imageconvertor' element={<ImageTextExtractor /> } />
          <Route path='/pdfconvertor' element={<PdfTextExtractor />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
