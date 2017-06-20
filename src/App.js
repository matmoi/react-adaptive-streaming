import React, { Component } from 'react'
import SourceSelector from './components/utils/SourceSelector.js'
import VideojsPlayer from './components/VideoPlayer/Videojs/Player.js'
import DashPlayer from './components/VideoPlayer/Dash/Player.js'
import HLSPlayer from './components/VideoPlayer/HLS/Player.js'
import { Nav, Navbar, NavItem, PageHeader, Grid } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class App extends Component {

  constructor(...args) {
    super(...args)
    this.state = {
      sources: []
    }
    this.useVideojs = null;
  }

  loadSrc(sourceUrl, mimeType, useVideojs) {
    this.setState({ sources: [{src:sourceUrl,type:mimeType}] })
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
          <SourceSelector onSubmit={this.loadSrc.bind(this)} />
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
