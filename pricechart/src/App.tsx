
import './App.css';
import { Box, Container } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PlainAppBar from './components/AppBar/plainAppBar';
import CoinPage from './components/coinPage/coinPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const darkTheme = createTheme({
    palette: {
      primary: {
        light: '#8748ae',
        main: '#6a1b9a',
        dark: '#4a126b',
        contrastText: '#fff',
      },
      secondary: {
        main: '#4caf50',
      },
    }
  });


  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
        <PlainAppBar />
          <Routes>
            <Route path="/" element={<CoinPage />} />
            <Route index path='coins' element={<CoinPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
