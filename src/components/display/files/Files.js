import React, { Component } from 'react'

export default class Files extends Component {
  render() {
    return (
      <div style={ style_div }>
        <h3>files</h3>
      </div>
    )
  }
}

const style_div = {
  flex: '9',
  overflowY: 'scroll',
}
