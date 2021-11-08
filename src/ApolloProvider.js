import React from 'react';
import App from './App';
import {ApolloClient,InMemoryCache, createHttpLink, ApolloProvider} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://still-retreat-18921.herokuapp.com/'
})

const authLink = setContext(() =>{
    const token = localStorage.getItem('jwtToken');
    return {headers:{
        Authorization: token ? `Bearer ${token}`: ''
    }}
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})



const Apollo= () =>(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)

export default Apollo;