import React from 'react';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    marginRight: 4,
  },
  wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '16px'
    },
};

const CardExampleWithAvatar = (props) => {

    let tags = [];

    for(let i = 0; i < props.tags.length; i++) {
        tags.push(
            <Chip style={styles.chip}>
                {props.tags[i].name}
            </Chip>
        )
    }

    return (
        <Card>
            <CardHeader
                title={props.author.username}
                subtitle={props.author.email}
                avatar="http://i.pravatar.cc/300"
            />
            <Divider />
            <CardTitle title={props.title} subtitle={props.location}/>
            <CardText>
                {props.body}
            </CardText>
            <Divider />
            <div style={styles.wrapper}>
                {tags}
            </div>
        </Card>
    )
};

export default CardExampleWithAvatar;
