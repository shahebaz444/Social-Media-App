import {useState} from 'react';
import {  Icon, Confirm,  Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const DELETE_POST_MUTATION = gql`
    mutation deletPost($postId:ID!){
        deletePost(postId:$postId)
    }
 `

const DELETE_COMMENT_MUTATION =gql`
    mutation deleteComment($postId:ID!, $commentId: ID!){
        deleteComment(postId:$postId, commentId: $commentId){
            body comments {
                body createdAt username id
            },
            id createdAt commentCount
        }
    }
`


const DeleteButton = ({postId, callBack, commentId}) => {
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletePostorComment] = useMutation(mutation,{
        variables:{
            postId, commentId
        },
        update(proxy){
            setConfirmOpen(false);

            if(!commentId){
                const data =proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                data.getPosts = data.getPosts.filter(post => post.id !== postId);
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data:data
                  });
            }

            if(callBack) callBack();
        }
    })

    return (
        <>
        <Button as='div' color='red' floated='right' onClick={()=>{setConfirmOpen(true)}}>
            <Icon name='trash' style={{margin:0}}></Icon>
        </Button>
        <Confirm 
            open={confirmOpen} onCancel={() =>{ setConfirmOpen(false)}}
            onConfirm={deletePostorComment}
        ></Confirm>
        </>
    )
}

export default DeleteButton
