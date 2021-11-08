import React from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from "../util/graphql";

const CREATE_POST_MUTATION = gql`
    mutation createPost($body:String!){
        createPost(body: $body){
            createdAt,body,username,id
        }
    }
`


const PostForm = () => {

    
    const {onSubmit, onChange, values} = useForm(createPostCallback,{
        body:''
    });

    const [createPost, {error}] =useMutation(CREATE_POST_MUTATION,{
        variables: values, 
        update(proxy, result){
          const data=  proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            values.body = ''
            let newData = [result.data.createPost,...data.getPosts];
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                  ...data,
                  getPosts: {
                    newData,
                  },
                },
              });
        },
        onError(err){
        },
    });

    function createPostCallback(){
        createPost()
    }

    return (
        <>
        <Form on onSubmit={onSubmit}>
            <h3>Create a Post:</h3>
            <Form.Field>
                <Form.Input placeholder='hi World'
                 name='body'
                 error={error?true:false}
                 value={values.body}
                 onChange={onChange}/>
                 <Button type='submit' color='teal'>Submit</Button>
            </Form.Field>
        </Form >
        {error &&<div className="ui error messge">
        {error.graphQLErrors[0].extensions.message}</div>}
        </>
    )
}

export default PostForm
