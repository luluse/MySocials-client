import React, { useContext, useState, useRef  } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Button, Card, Form, Grid, Image, Icon, Label } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  console.log(postId);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { 
    data: { getPost }
   = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image className="ui circular mini right floated image"
              src="https://lh3.googleusercontent.com/o4U2kkoTg_wNdljf6X84hB6I4ObY4gdadPL6ZxlvfXkn_jE96JwqDRgl8n_XhwOnp41_m28EH95gqE3eKonaARhHuaixPRpcv-34niqXhZU49Q-_7wBI-ecpAG9RPD3dhCTDsNVJOqTpyAR1--RF03rFFc_NTguUkqEmHXSt1JzwTzeTMtFdmS8QuNhR6kMFYJWZhC2cN8HFKM3wC9yEEka6E1PnrQpyM-zKuGkPGegEN96YMBV1Ne0d89q_fMJhCJwCICXS5RHI7u35qH_28tR9VsIha7YIkQ8yqSShKs5SBjdGqnLTrYIGkE_CqHohbya5jpZCwu8OybCFaVTT-9KHfKFL5j7I-QJjDSJ5Q4_VZQ1S6_k8Pzbr5BkOSjIjq41vWt0Os3mDU12NTyROf4hEcbp0Q5UOAG5BndGlWdLAi9EgOU5i2aEd28W9SOINovI7BgpErqZkRyBo2hCKc1zes4Gt__lSdWmnVC_v4-vggNGPu7X4hJgm1Qv_FbJS6ub-dagIkNc6yrHjCbaQdQHJTO-5Uqv_tjYzGo977kEQwQ3INICChFB7tTrrDQXOvst3VmeIRwaAbi5GykH4lxHvxMtPEy8cElq6cwhfj4xm9X6oYSHyRb1fTYHljKxok42i4fczDxp140Ld-DlGrhL-Ub2xj01fwqxdFeAzBefFS7bwRjrrJUqvSI4bOfhEWw-3tItufUv7x8YnydUV567iKw=s132-no?authuser=0"

            />
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
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color="violet">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="violet" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button violet"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;