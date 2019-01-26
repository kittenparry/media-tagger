import React, { Component } from 'react'

export default class Files extends Component {
  render() {
    return (
      <div className='display_div' style={ style_div }>
        <h3>files</h3>
      </div>
    )
  }
}

const style_div = {
  flex: '19',
  overflowY: 'scroll',
}
