import React,{useContext} from 'react';
import { Route,Navigate  } from 'react-router-dom';

import {AuthContext} from './auth';

function AuthRoute({component: Component, ...rest}){
    const {user} = useContext(AuthContext);
    console.log(user)

    return(
        <Route {...rest}
        render={props =>user?
        <Navigate  to='/' />:<Component  {...props}/> } ></Route>
    )
}


export default AuthRoute;