import React, { Component } from 'react';
import './App.css';

import Tree from './components/display/tree/Tree';
import Tags from './components/display/tags/Tags';
import Search from './components/display/search/Search';
import Files from './components/display/files/Files';

class App extends Component {
  render() {
    return (
      <div className="App flex-row" 
      style={ style_app }>
        <div className='display_div flex-col' 
        style={ style_left }>
          <Tree className=''/>
          <Tags className=''/>
        </div>
        <div className='display_div flex-col' 
        style={ style_right }>
          <Search className='flex-1'/>
          <Files className='flex-9'/>
        </div>
      </div>
    );
  }
}

const style_app = {
  height: '99%',
  width: '99%',
};
const style_left = {
  flex: '2',
};
const style_right = {
  flex: '7',
}

export default App;
