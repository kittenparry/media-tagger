import React from 'react';
import {Treebeard} from 'react-treebeard';
import data from './example';

class TreeTest extends React.Component {
  constructor(props){
      super(props);
      this.state = {};
      this.onToggle = this.onToggle.bind(this);
  }
  onToggle(node, toggled){
      if(this.state.cursor){this.state.cursor.active = false;}
      node.active = true;
      if(node.children){ node.toggled = toggled; }
      this.setState({ cursor: node });
  }
  render(){
      return (
          <Treebeard
              data={data}
              onToggle={this.onToggle}
              animations={false}
          />
      );
  }
}

export default TreeTest;
