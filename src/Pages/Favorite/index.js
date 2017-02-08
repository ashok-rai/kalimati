import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List'

class FavoritePage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="page page-bg-gradient">
        { Object.keys(this.props.Parent.state.favoriteList).length ?
        <div>
          <h3>मनपर्ने सूची</h3>
          <List>
            { this.props.Parent.state.data.map((item, i) => this.props.Parent.state.favoriteList[item['कृषि उपज']] && <ListItem
            key={`key${ i }`}
            primaryText={ item['कृषि उपज'] }
            secondaryText={<p className="price">रू.   {item['औसत']} प्रति {item['ईकाइ']}</p>} />) }
          </List>
        </div>
        : <h3>हैट !! मनपर्ने सूची त खाली पो छ त !</h3> }
      </div>
    )
  }
}

export default FavoritePage