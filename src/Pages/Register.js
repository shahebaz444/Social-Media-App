import {useState,useContext} from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useNavigate  } from 'react-router-dom';
import gql from "graphql-tag";
import { useForm } from '../util/hooks';
import { AuthContext} from '../Context/auth';


const REGISTER_USER = gql`
mutation register(
  $username: String!
  $password: String!
  $confirmPassword: String!
  $email: String!
){
    register(
        registerInput:{
            username: $username
            password: $password
            confirmPassword: $confirmPassword
            email: $email
        }
    ){
        id email username createdAt token
    }
}`;

const Register = () => {
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    const [errors, setErrors] = useState({});
    
    const {onChange, onSubmit, values} =useForm(registerUser, {
        username:'',
        password:'',
        confirmPassword:'',
        email: ''
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER,{
        update(_, {data:{register: userData}}){
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

    function registerUser(){
        addUser();
    }
    

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading?'loadin':''}>
                <h1>Register</h1>
                <Form.Input label="username" placeholder="username" error={errors.username?true:false}
                name="username" value={values.username} onChange={onChange}></Form.Input>

                <Form.Input label="Password" placeholder="Password" type='password' error={errors.password?true:false}
                name="password" value={values.password} onChange={onChange}></Form.Input>

                <Form.Input label="Confirm Password" placeholder="Confirm Password" type='password' error={errors.confirmPassword?true:false}
                name="confirmPassword" value={values.confirmPassword} onChange={onChange}></Form.Input>

                <Form.Input label="Email" placeholder="Email" type='email' error={errors.email?true:false}
                name="email" value={values.email} onChange={onChange}></Form.Input>
                <Button type='submit' primary>Register</Button>
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

export default Register
