import React,{useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { AuthContext} from '../Context/auth';
import {  Icon, Label,  Button } from 'semantic-ui-react';


const LIEK_POST_MUTATION =  gql`
mutation likePost($postId: ID!){
    likePost(postId:$postId){
        id
        likes{
            id username
        }
        likeCount
    }
}`;


const LikeButton = ({post:{id, likes, likeCount} }) => {

    const {user} = useContext(AuthContext);
    const [liked, setLiked] = useState(false);

    const [likePost] = useMutation(LIEK_POST_MUTATION,{
        variables:{
            postId:id
        }
    })
    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        }
        else{
            setLiked(false)
        }
        return () => {
            
        }
    }, [user, likes]);


    const likedButton = user ? (
        liked ? (<Button color='teal'>
          <Icon name='heart' />
        </Button>
    ):
       ( <Button color='teal' basic>
                <Icon name='heart' />
        </Button>)
  ):(
        <Button color='teal' as={Link} to={'/login'} basic>
            <Icon name='heart' />
        </Button>
  );

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
        {likedButton}
        <Label as='a' basic color='teal' pointing='left'>
          {likeCount}
        </Label>
      </Button>
    )
}

export default LikeButton
