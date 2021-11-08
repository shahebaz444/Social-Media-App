import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import SinglePost from './Pages/SinglePost'
import MenuBar from "./Components/MenuBar";
import {AuthProvider} from './Context/auth';
import AuthRoute from "./Context/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">
        <MenuBar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <AuthRoute exact path='/login' element={<Login />} />
          <AuthRoute exact path='/register' element={<Register />} />
          <Route exact path='/posts/:postId' element={<SinglePost />} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
