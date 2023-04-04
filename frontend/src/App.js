import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
// import ViewProfile from './accounts/pages/viewProfile';
// import EditProfile from './accounts/pages/editProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path='accounts'>
            {/* <Route path='profile/view/:userID' element={<ViewProfile />} />
            <Route path='profile/edit' element={<EditProfile />} /> */}
          </Route>
          { 
            // TODO: Add remaining routes here. 
          }
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
