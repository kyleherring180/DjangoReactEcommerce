import React from 'react';
import { Icon, Card } from 'semantic-ui-react'

const Articles = (props) =>{
  const data = props.data;
  return(

        <Card.Group>
        {data.map(item => {
          return(
            <Card fluid key={item.id}>
              <Card.Content as='a' href={`/articles/${item.id}`} header={item.title} />
              <Card.Content description={item.content} />
              <Card.Content extra>
                <Icon color='green' name='check' /> 121 Votes
              </Card.Content>
            </Card>
            );
          })}
        </Card.Group>

  );
}

export default Articles;
