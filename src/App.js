import React, { Component } from 'react'
import SourceSelector from './components/utils/SourceSelector.js'
import VideojsPlayer from './components/VideoPlayer/Videojs/Player.js'
import DashPlayer from './components/VideoPlayer/Dash/Player.js'
import { Nav, Navbar, NavItem, PageHeader, Col, Row, Grid } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class App extends Component {

    constructor(...args) {
        super(...args)
        this.state = {
            sources: []
        }
    }

  loadSrc(source) {
    this.setState({sources:[source]})
  }

  render() {
    return (
      <div>
        <PageHeader>
          <span>
            ABR stream dashboard <small> HLS and DASH compliance tool</small>
          </span>
        </PageHeader>
        <Grid fluid={true}>
          <Row className="show-grid">
            <Col md={12}>
              <SourceSelector onSubmit={this.loadSrc.bind(this)}/>
            </Col>
          </Row>
          <DashPlayer sources={this.state.sources} />
          {/*<VideojsPlayer
            sources={this.state.sources}
          />*/}
        </Grid>
        <Navbar className="fixedBottom">
          <Navbar.Header>
            <Navbar.Brand>
              react-adaptive-streaming
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem href="https://github.com/matmoi/react-adaptive-streaming"><FontAwesome name='github'/>{' Github'}</NavItem>
            <NavItem href="https://github.com/matmoi/create-DASH-HLS">How-to: generate dash/hls streams</NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}
