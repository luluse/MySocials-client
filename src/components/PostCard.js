import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {

  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          className="ui circular mini right floated image"
          src="https://lh3.googleusercontent.com/o4U2kkoTg_wNdljf6X84hB6I4ObY4gdadPL6ZxlvfXkn_jE96JwqDRgl8n_XhwOnp41_m28EH95gqE3eKonaARhHuaixPRpcv-34niqXhZU49Q-_7wBI-ecpAG9RPD3dhCTDsNVJOqTpyAR1--RF03rFFc_NTguUkqEmHXSt1JzwTzeTMtFdmS8QuNhR6kMFYJWZhC2cN8HFKM3wC9yEEka6E1PnrQpyM-zKuGkPGegEN96YMBV1Ne0d89q_fMJhCJwCICXS5RHI7u35qH_28tR9VsIha7YIkQ8yqSShKs5SBjdGqnLTrYIGkE_CqHohbya5jpZCwu8OybCFaVTT-9KHfKFL5j7I-QJjDSJ5Q4_VZQ1S6_k8Pzbr5BkOSjIjq41vWt0Os3mDU12NTyROf4hEcbp0Q5UOAG5BndGlWdLAi9EgOU5i2aEd28W9SOINovI7BgpErqZkRyBo2hCKc1zes4Gt__lSdWmnVC_v4-vggNGPu7X4hJgm1Qv_FbJS6ub-dagIkNc6yrHjCbaQdQHJTO-5Uqv_tjYzGo977kEQwQ3INICChFB7tTrrDQXOvst3VmeIRwaAbi5GykH4lxHvxMtPEy8cElq6cwhfj4xm9X6oYSHyRb1fTYHljKxok42i4fczDxp140Ld-DlGrhL-Ub2xj01fwqxdFeAzBefFS7bwRjrrJUqvSI4bOfhEWw-3tItufUv7x8YnydUV567iKw=s132-no?authuser=0"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="violet" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="violet" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;