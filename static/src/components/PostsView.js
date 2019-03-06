import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import PostCard from "./PostCard";
import IconButton from 'material-ui/IconButton';
import AddCircle from 'material-ui/svg-icons/navigation/refresh';

function mapStateToProps(state) {
    return {
        data: state.data,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}

const wrapperStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PostsView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.props.fetchData();
    }

    render() {
        let posts = [];
        if(this.props.loaded) {
            let post_data = this.props.data.data;
            post_data.sort(function(a, b) {return b.id - a.id});

            for (let i = 0; i < post_data.length; i++) {
                posts.push(
                    <PostCard
                        title={post_data[i].title}
                        body={post_data[i].body}
                        author={post_data[i].author}
                        location={post_data[i].location.name}
                        tags={post_data[i].tags }/>,
                    <br />
                )
            }
        }

        return (
            <div>
                <div style={wrapperStyles}>
                    <h1>Posts</h1>
                    <IconButton tooltip="Refresh" onClick={this.props.fetchData}>
                        <AddCircle />
                    </IconButton>
                </div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        {posts}
                    </div>
                }
            </div>
        );
    }
}

PostsView.propTypes = {
    fetchData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
};
