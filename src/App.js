import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import PdfTextExtractor from './components/PdfTextExtractor';
import { makeStyles } from '@mui/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ImageTextExtractor from './components/ImageTextExtractor';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(90deg, rgba(2,142,253,0.9892157546612395) 20%, rgba(0,191,179,1) 85%)',
    height: '100%',

  },
});

function App() {
  const classes = useStyles();
  return (
    <div className={`${classes.root} "App"`}>
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
