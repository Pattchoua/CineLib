import './index.css'
import Header from './components/Header';
import MainBody from "./components/MainBody";
import Footer from "./components/Footer";


const App = () => {
  
  return (
    <div className='bg-gray-800'>
        <Header />
        <MainBody />
        <Footer />
    </div>
  
  );
};

export default App;

