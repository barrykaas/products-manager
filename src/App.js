import logo from './logo.svg';
import './App.css';
//import ShoppingListForm from './shoppinglist'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
//import BrandList from './brandsList';
import { Paper, Container} from '@mui/material';
import ButtonAppBar from './MyAppBar'
//import ProductTable from './productsTable'
import QRCodeView from './BarcodeScanner'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      {      
      /* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>

          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        < BrandList />
      </header>
       */}
       <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ButtonAppBar />
   
      
        <Paper>
        <QRCodeView />
        </Paper>
      
      
      
      </ThemeProvider>


    </div>
  );
}

export default App;
