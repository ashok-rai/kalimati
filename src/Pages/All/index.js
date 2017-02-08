import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'
import IconButton from 'material-ui/IconButton'
import { red400 } from 'material-ui/styles/colors'

class AllPage extends Component {
  constructor(props) {
    super(props)
  }

  handleFavoriteToggle = (itemName) => {
    let list = this.props.Parent.state.favoriteList
    if (list[itemName]) {
      delete list[itemName]
    } else {
      list[itemName] = true
    }
    this.props.Parent.updateFavoriteList(list)
  }

  render() {
    return (
      <div className="page page-bg-gradient">
        <h3>दैनिक खुद्रा औसत मूल्य विवरण</h3>
        <List>
          { this.props.Parent.state.data.map((item, i) => <ListItem
          key={`key${ i }`}
          primaryText={ item['कृषि उपज'] }
          secondaryText={<p className="price">रू.   {item['औसत']} प्रति {item['ईकाइ']}</p>}
          rightIconButton={ <IconButton onTouchTap={ () => this.handleFavoriteToggle(item['कृषि उपज']) }>
            {this.props.Parent.state.favoriteList[item['कृषि उपज']] ? <ActionFavorite color={ red400 } /> : <ActionFavoriteBorder hoverColor={ red400 } />}
            </IconButton> } />) }
        </List>
      </div>
    )
  }
}

export default AllPage