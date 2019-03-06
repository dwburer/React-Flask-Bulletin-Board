import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppBar from 'material-ui/AppBar';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AddCircle from 'material-ui/svg-icons/content/add-circle';


import * as actionCreators from '../../actions/auth';
import * as dataActionCreators from '../../actions/data';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign(actionCreators, dataActionCreators), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openDialog: false,
            titleToSubmit: '',
            bodyToSubmit: '',
            hasSubmittedPost: false
        };
    }

    submitData() {
        const token = this.props.token;
        this.props.postProtectedData(
            token,
            this.state.titleToSubmit,
            this.state.bodyToSubmit,
            1
        );
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    handleOpen = () => {
        this.setState({openDialog: true});
    };

    handleClose = () => {
        this.setState({openDialog: false});
    };

    handleCloseWithData = () => {
        this.setState({openDialog: false});
        this.submitData();
    };

    handleClickOutside() {
        this.setState({
            open: false,
        });
    }

    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {

        console.log(this.state);

        var navFlatButtonsStyle = {
            color: 'white'
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Post"
                primary={true}
                onClick={this.handleCloseWithData}
            />,
        ];

        return (
            <header>
                <LeftNav open={this.state.open}>
                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/posts')}>
                                    Posts
                                </MenuItem>
                                <MenuItem onClick={() => this.dispatchNewRoute('/login')}>
                                    Login
                                </MenuItem>
                                <MenuItem onClick={() => this.dispatchNewRoute('/register')}>
                                    Register
                                </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem onClick={() => this.dispatchNewRoute('/posts')}>
                                    Posts
                                </MenuItem>
                                <Divider/>
                                <MenuItem onClick={(e) => this.logout(e)}>
                                    Logout
                                </MenuItem>
                            </div>
                    }
                </LeftNav>
                <AppBar
                    title="Dist Web Project"
                    onLeftIconButtonTouchTap={() => this.openNav()}
                    iconElementRight=
                        {
                            !this.props.isAuthenticated ?
                                <div style={{padding: '6px'}}>
                                    <FlatButton label="Posts" style={navFlatButtonsStyle}
                                                onClick={() => this.dispatchNewRoute('posts')}/>
                                </div>
                                :
                                <div style={{padding: '6px'}}>
                                    <FlatButton label="Posts" style={navFlatButtonsStyle}
                                                onClick={() => this.dispatchNewRoute('/')}/>
                                    <FlatButton label={"New"} icon={<AddCircle/>} style={navFlatButtonsStyle}
                                                onClick={this.handleOpen}/>
                                    <Dialog
                                        actions={actions}
                                        modal={false}
                                        open={this.state.openDialog}
                                        onRequestClose={this.handleClose}
                                    >
                                        <TextField
                                            floatingLabelText="Title"
                                            onChange={(e) => {this.state.titleToSubmit = e.target.value}}
                                        /><br/>
                                        <TextField
                                            floatingLabelText="What's going on?"
                                            multiLine={true}
                                            fullWidth={true}
                                            onChange={(e) => {this.state.bodyToSubmit = e.target.value}}
                                            rows={1}
                                            rowsMax={4}
                                        /><br/>
                                    </Dialog>
                                </div>
                        }
                />
            </header>

        );
    }
}

Header.propTypes = {
    postProtectedData: React.PropTypes.func,
    logoutAndRedirect: React.PropTypes.func,
    isAuthenticated: React.PropTypes.bool,
    hasSubmittedPost: React.PropTypes.bool,
};
