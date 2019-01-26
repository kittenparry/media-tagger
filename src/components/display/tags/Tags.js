import React, { Component } from 'react'

export default class Tags extends Component {
  render() {
    return (
      <div style={ style_div }>
        <h3>tags</h3>
      </div>
    )
  }
}

const style_div = {
  flex: '2',
  overflowY: 'scroll',
}
