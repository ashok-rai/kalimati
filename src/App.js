import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { grey900, grey400 } from 'material-ui/styles/colors'
import injectTapEventPlugin from 'react-tap-event-plugin'
import AppBar from 'material-ui/AppBar'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionViewList from 'material-ui/svg-icons/action/view-list'

import FavoritePage from './Pages/Favorite/'
import AllPage from './Pages/All/'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: grey900,
    accent1Color: grey400
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideIndex: 0,
      dateEn: localStorage.getItem('dateEn'),
      dateNp: localStorage.getItem('dateNp'),
      data: JSON.parse(localStorage.getItem('data')) || [],
      favoriteList: JSON.parse(localStorage.getItem('favoriteList')) || {}
    }

     this.updateData = this.updateData.bind(this)
     this.updateDateEn = this.updateDateEn.bind(this)
     this.updateDateNp = this.updateDateNp.bind(this)
  }

  updateData (data) {
    this.setState({ data })
    localStorage.setItem('data', JSON.stringify(data))
  }

  updateFavoriteList (favoriteList) {
    this.setState({ favoriteList })
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList))
  }

  updateDateEn (dateEn) {
    this.setState({ dateEn })
    localStorage.setItem('dateEn', dateEn)
  }

  updateDateNp (dateNp) {
    this.setState({ dateNp })
    localStorage.setItem('dateNp', dateNp)
  }

  componentWillMount () {
    if (this.state.dateEn && this.isToday(this.state.dateEn)) return

    let data = []
    fetch('https://cors-anywhere.herokuapp.com/kalimatimarket.com.np/priceinfo/dlypricebulletin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: 'cdate=&pricetype=R'
      })
      .then(res => res.text())
      .then(html => {
        let tableRows = [...Object.assign(document.createElement('div'), {
          innerHTML: html
        }).querySelectorAll('table')[1].rows]

        this.updateDateNp(tableRows[1].cells[0].innerText.trim())

        let headers = [...tableRows[2].cells].map(td => td.innerText.trim())

        data = tableRows.map((row, i) => {
          let obj = {}
          if(i > 2) {
            [...row.cells].map((td, j) => {
              obj[headers[j]] = td.innerText.trim()
            })
            return obj
          }
        }).splice(3)

        this.updateData(data)
        this.updateDateEn(Date.now())
        data = []
      })
      .catch(console.error)
  }

  isToday = date => new Date(date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    })
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
          className="appbar-bg"
          title="कालीमाटी"
          showMenuIconButton={false}
          zDepth={0}
          />
          <Tabs
          className="tabbar-bg"
          onChange={this.handleChange}
          value={this.state.slideIndex}
          >
          <Tab icon={<ActionFavorite />} value={0} />
          <Tab icon={<ActionViewList />} value={1} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <FavoritePage Parent={ this } />
          <AllPage Parent={ this } />
        </SwipeableViews>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
