import React, { Component } from 'react';
import TreeTest from './TreeTest';

export default class Tree extends Component {
  render() {
    return (
      <div id='div_tree' className='display_div' style={ style_div }>
        <h3>tree</h3>
        <TreeTest/>
      </div>
    )
  }
}
const test_dir = 'E:/from4chan/4chan';

const style_div = {
  flex: '3',
  overflow: 'scroll',
  whiteSpace: 'nowrap',
}
console.log();
