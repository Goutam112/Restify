import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateProperty from './pages/CreateProperty/CreateProperty';
import MyRentalUnits from './pages/MyRentalUnits/MyRentalUnits';
import UpdateProperty from './pages/UpdateProperty/UpdateProperty';
import MyReservations from './pages/MyReservations/MyReservations';
import ViewProfile from './pages/Profile/viewProfile';
import EditProfile from './pages/Profile/editProfile';
import { ViewProperty } from './pages/ViewProperty/viewProperty';
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
            <Route path='profile/view/:userID' element={ <ViewProfile /> } />
            <Route path='profile/edit' element={ <EditProfile /> } />
          </Route>
          <Route path='properties'>
            <Route index element={ <MyRentalUnits></MyRentalUnits> }></Route>
            <Route path='create' element={ <CreateProperty /> } />
            <Route path='update/:propertyID' element={ <UpdateProperty /> } />
            <Route path='view/:propertyID' element={ <ViewProperty /> } />
          </Route>
          <Route path='reservations'>
            <Route path='retrieve/all' element={ <MyReservations></MyReservations> }></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
