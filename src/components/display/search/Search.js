import React, { Component } from 'react'

export default class Search extends Component {
  render() {
    return (
      <div className='display_div' style={ style_div }>
        <form>
          <input type='text' name='search' placeholder='Search a tag...'/>
          <input type='submit' value='Search'/>
        </form>
      </div>
    )
  }
}

const style_div = {
  flex: '1',
}
