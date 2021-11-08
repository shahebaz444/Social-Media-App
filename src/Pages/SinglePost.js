import React,{useContext, useState, useRef} from 'react';
import { useParams } from 'react-router';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Card, Grid, Image, Icon, Label, Form } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../Components/LikeButton';
import { AuthContext } from '../Context/auth';
import { useNavigate  } from 'react-router-dom';
import DeleteButton from '../Components/DeleteButton';

export const FETCH_POST_QUERY = gql`
    query getPost($postId:ID!){
        getPost(postId: $postId){
            id body createdAt username likeCount 
            likes{
                username 
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }`


export const SUBMIT_COMMENT_QUERY =gql`
    mutation createComment($postId: ID!, $body: String!){
        createComment(postId:$postId, body: $body){
                id    body comments {
            body createdAt username
            },likes {
            id username createdAt
            }
        }
    }
`

const SinglePost = () => {
    const navigate = useNavigate();
    const commentInputRef = useRef(null);

    const deletePostCallback = () =>{
        navigate('/');
    }

    const { user } = useContext(AuthContext)
    const { postId } = useParams();

    const {data} = useQuery(FETCH_POST_QUERY,{
        variables:{
            postId
        }
    });

    const [comment, setComment] = useState('');

    const [submitComment] = useMutation(SUBMIT_COMMENT_QUERY,{
        variables:{
            postId,
            body: comment
        },
        update(){
            setComment('');
            commentInputRef.current.blur();
        }
    })

    let postMarkup;
    if(!data)
        postMarkup= <p>Loading...</p>
    else{
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;
        postMarkup = (
        <Grid>
            <Grid.Row>
                <Grid.Column width={2}>
                        <Image
                            floated='left' 
                            size='small'           
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'/>
                </Grid.Column>

                <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr />
                        <Card.Content extra>
                            <LikeButton post={{id, likes, likeCount}}/>
                            <Button as='div' labelPosition='right' onClick={()=>{}}>
                                <Button basic color='blue'>
                                    <Icon name='comments'></Icon>
                                </Button>
                                <Label basic color='blue' pointing='left'>{commentCount}</Label>
                            </Button>
                            {user && user.username===username &&
                             (<DeleteButton postId={postId} callBack={deletePostCallback}/>)}
                        </Card.Content>
                        {user && (<Card fluid>
                            <Card.Content>
                            <p>post a comment:</p>
                            <Form>
                                <div className="ui fluid input action">
                                    <input type="text"
                                     placeholder='comment...'
                                     value={comment}
                                     onChange={e => setComment(e.target.value)}
                                     ref={commentInputRef}
                                     />
                                     <button className="ui teal button"
                                        type='submit' disabled={comment.trim() === ''}
                                        onClick={submitComment}
                                     >Submit</button>
                                </div>
                            </Form>
                            </Card.Content>
                        </Card>

                        )}
                        { comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    { user && user.username === comment.username &&
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    }
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                            ))
                        }
                    </Card>
                </Grid.Column>

                
            </Grid.Row>
        </Grid>)
    }

    return postMarkup;
    
}

export default SinglePost
