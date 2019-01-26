import React, { Component } from 'react';
import './App.css';

import Tree from './components/display/tree/Tree';
import Tags from './components/display/tags/Tags';
import Search from './components/display/search/Search';
import Files from './components/display/files/Files';

class App extends Component {
  render() {
    return (
      <div className="App" style={ style_app }>
        <div style={ style_left }>
          <Tree style={ style_tree }/>
          <Tags style={ style_tags }/>
        </div>
        <div style={ style_right }>
          <Search style={ style_search }/>
          <Files style={ style_files}/>
        </div>
      </div>
    );
  }
}

const style_app = {
  display: 'flex',
  height: '100%',
};
const style_left = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
};
const style_right = {
  flex: '3',
  display: 'flex',
  flexDirection: 'column',
};
const style_tree = {
  flex: '3',
};
const style_tags = {
  flex: '2',
};
const style_search = {
  flex: '1',
};
const style_files = {
  flex: '9',
};

export default App;
