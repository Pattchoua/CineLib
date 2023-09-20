import { Routes, Route} from 'react-router-dom'
import HomePage  from './HomePage'
import MoviesPage from './MoviesPage'
import DetailsPage from './DetailsPage'
import FavoritePage from './FavoritePage'

const MainBody = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element ={<HomePage />}/>
        <Route path="/Movies" element ={<MoviesPage />}/>
        <Route path="/Movies/:id" element ={<DetailsPage />}/>
        <Route path="/Favorites" element ={<FavoritePage />}/>
      </Routes>
    </div>
  )
}

export default MainBody
