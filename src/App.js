import React, { Component } from 'react'
import SourceSelector from './components/utils/SourceSelector.js'
import VideojsPlayer from './components/VideoPlayer/Videojs/Player.js'
import DashPlayer from './components/VideoPlayer/Dash/Player.js'
import HLSPlayer from './components/VideoPlayer/HLS/Player.js'
import { Nav, Navbar, NavItem, PageHeader, Col, Row, Grid } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class App extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      sources: []
    }
    this.useVideojs = null;
  }

  loadSrc(source, useVideojs) {
    this.setState({ sources: [source] })
    this.useVideojs = useVideojs
  }

  render() {
    let player = <VideojsPlayer sources={this.state.sources} />
    if (this.state.sources.length > 0 && ! this.useVideojs) {
      if (this.state.sources[0].type === "application/dash+xml") {
        player = <DashPlayer sources={this.state.sources} />
      }
      else if (this.state.sources[0].type === "application/x-mpegURL") {
        player = <HLSPlayer sources={this.state.sources} />
      }
    }
    return (
      <div>
        <PageHeader>
          <span>
            HTTP Live Streaming <small> for HLS and DASH </small>
          </span>
        </PageHeader>
        <Grid fluid={true}>
          <Row className="show-grid">
            <Col md={12}>
              <SourceSelector onSubmit={this.loadSrc.bind(this)} />
            </Col>
          </Row>
          {player}
        </Grid>
        <Navbar className="fixedBottom">
          <Navbar.Header>
            <Navbar.Brand>
              react-adaptive-streaming
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem href="https://github.com/matmoi/react-adaptive-streaming"><FontAwesome name='github' />{' Github'}</NavItem>
            <NavItem href="https://github.com/matmoi/create-DASH-HLS">How-to: generate dash/hls streams</NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}
