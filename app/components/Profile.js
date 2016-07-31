import React from 'react'
import UserProfile from './Github/UserProfile'
import Repos from './Github/Repos'
import Notes from './Notes/Notes'
import firebase from '../config/firebase'
import getGithubInfo from '../utils/helpers'
import Rebase from 're-base'

const base = Rebase.createClass(firebase.databaseURL)

class Profile extends React.Component{
  constructor(props) {
    super(props)
    this.state = this.initialState()
  }
  initialState() {
    return { bio: {}, repos: [], notes: [] }
  }
  handleAddNote(newNote){
    base.post(this.props.params.username, {
      data: this.state.notes.concat([newNote])
    })
  }
  componentDidMount(){
    this.init(this.props.params.username)
  }
  componentWillUnmount(){
    base.removeBinding(this.ref)
  }
  componentWillReceiveProps(nextProps) {
    console.log('next', nextProps)
    base.removeBinding(this.ref)
    this.setState(this.initialState());
    this.init(nextProps.params.username);
  }
  init(username){
    this.ref = base.bindToState(username, {
      context: this,
      asArray: true,
      state: 'notes'
    })

    getGithubInfo(username)
    .then((data) => {
      this.setState({
        bio: data.bio,
        repos: data.repos
      })
    })
  }
  render(){
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={this.props.params.username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={this.props.params.username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes
            username={this.props.params.username}
            notes={this.state.notes}
            addNote={(newNote) => this.handleAddNote(newNote)} />
        </div>
      </div>
    )
  }
};

export default Profile
