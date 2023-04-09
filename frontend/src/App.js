import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
// import ViewProfile from './accounts/pages/viewProfile';
// import EditProfile from './accounts/pages/editProfile';

// ####### HAVEN'T MADE THESE PAGES YET #######
import Home from './pages/Home';
import NotificationsPage from './pages/NotificationsPage';
import Login from './pages/Login';
import Register from './pages/Register'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={ <Home /> } />
          <Route path='login' element={ <Login /> } />
          <Route path='register' element={ <Register /> } />
          <Route path='notifications' element={ <NotificationsPage /> } />
          <Route path='accounts'>
            {/* <Route path='profile/view/:userID' element={<ViewProfile />} />
            <Route path='profile/edit' element={<EditProfile />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
