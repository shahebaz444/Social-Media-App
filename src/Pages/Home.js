import React,{useContext} from 'react';
import { useQuery } from "@apollo/client";
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from "../Components/PostCard";
import { AuthContext } from '../Context/auth';
import PostForm from '../Components/PostForm';
import { FETCH_POSTS_QUERY } from "../util/graphql";


const Home = () => {
    const {user } = useContext(AuthContext);
    const {loading, data} = useQuery(FETCH_POSTS_QUERY);
    return (
        <Grid columns={1} divided>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
                {user && <Grid.Column><PostForm /></Grid.Column>}
            <Grid.Row>
                {loading ? (
                    <h1>Loading...</h1>
                ):(
                    <Transition.Group>
                    {data.getPosts && data.getPosts.map(post =>(
                        <Grid.Column key={post.id} style={{ marginBottom: 20}}>
                            <PostCard post={post} />
                        </Grid.Column>
                        ))}
                        </Transition.Group>
                )}

            </Grid.Row>
        </Grid>
    )
}



export default Home
