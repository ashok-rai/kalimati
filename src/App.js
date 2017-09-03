import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { green700, deepOrange500 } from 'material-ui/styles/colors'
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
    primary1Color: green700,
    accent1Color: deepOrange500
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
    if (this.state.dateEn && Math.abs((new Date() - new Date(this.state.dateEn))) / 36e5 < 2) return

    let data = []
    fetch('https://cors-anywhere.herokuapp.com/kalimatimarket.com.np/priceinfo/dlypricebulletin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'http://kalimatimarket.gov.np'
        },
        body: `cdate=${getFormattedDate(new Date())}&pricetype=R`
      })
      .then(res => res.text())
      .then(html => {
        let tableRows = [...Object.assign(document.createElement('div'), {
          innerHTML: html
        }).querySelectorAll('table')[1].rows]

        let dateNp = tableRows[1].cells[0].innerText.trim()
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

        if (data.length) {
          this.updateData(data)
          this.updateDateNp(dateNp)
          this.updateDateEn(new Date())
          data = []
        }
      })
      .catch(console.error)
  }

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
          title={ <div className="appbar-title">
            <span>कालीमाटी</span>
            <span className="date-np">मिति: {this.state.dateNp}</span>
            </div> }
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

function getFormattedDate (date) {
  let month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  let day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return month + '/' + day + '/' + date.getFullYear()
}

export default App
