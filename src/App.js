import React, { Component } from 'react';
import Aux from './hoc/Aux/Aux'
import JournalistPage from './containers/JournalistPage/JournalistPage'
import HomePage from './containers/HomePage/HomePage'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      homepage: true,
      nameSearched: "",
      journalistPageNameSearch: "",
    }
  }

  //handler for switching from homepage to journalist page
  switchPageHandler = () => {
    this.setState({ homepage: false })
  }

  setNameHandler = (event) => {
    this.setState({
      nameSearched: event.target.value
    })
  }

  set = (event) => {
    this.setState({
      journalistPageNameSearch: event.target.value
    })
  }

  changeJournalistHandler = () => {
    this.setState({nameSearched: this.state.journalistPageNameSearch})
  }

  render() {

    let page = <HomePage
      clicked={this.switchPageHandler}
      nameChange={(event) => this.setNameHandler(event)}
      nameValue={this.state.nameSearched}
    />

    if (!this.state.homepage) {
      page = <JournalistPage
        journalistName={this.state.nameSearched}
        nameSearchBarValue = {this.state.journalistPageNameSearch}
        nameSearchBarChange = {(event) => this.set(event)}
        searchBarClicked={this.changeJournalistHandler}/>
    }

  

    return (
      <Aux>
        {page}
      </Aux>
    );
  }
}

export default App;
