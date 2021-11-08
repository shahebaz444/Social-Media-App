import React,{useState, useContext} from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useNavigate  } from 'react-router-dom';
import gql from "graphql-tag";
import { useForm } from "../util/hooks";
import { AuthContext} from '../Context/auth';

const LOGIN_USER = gql`
mutation register(
  $username: String!
  $password: String!
){
    login(
            username: $username
            password: $password
    ){
        id email username createdAt token
    }
}`;

const Login = () => {

    const context = useContext(AuthContext);

    const loginUserCallback = (event) =>{
        loginUser();
    }

    const {onChange, onSubmit, values} = useForm(loginUserCallback,{
        username: '',
        password:''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const [loginUser, { loading }] = useMutation(LOGIN_USER,{
        update(_, {data: { login: userData}}){
            context.login(userData);
            navigate('/');
        },
        onError(err){
            console.log(err);
            setErrors(err.graphQLErrors[0].extensions.errors);
            console.log(errors);
        },
        variables: values
    })

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading?'loadin':''}>
                <h1>Login</h1>
                <Form.Input label="username" placeholder="username" error={errors.username?true:false}
                name="username" value={values.username} onChange={onChange}></Form.Input>

                <Form.Input label="Password" placeholder="Password" type='password' error={errors.password?true:false}
                name="password" value={values.password} onChange={onChange}></Form.Input>

                <Button type='submit' primary>Login</Button>
            </Form>
            {Object.values(errors).length>0 &&<div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value =>(
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>}
        </div>
    )
}

export default Login
