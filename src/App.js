import React, { Component } from 'react'
import VideojsPlayer from './components/VideoPlayer/Videojs/Player.js'
import { PageHeader, Col, Row, Grid } from 'react-bootstrap'

export default class App extends Component {
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
              Pick up a stream
            </Col>
          </Row>
          <VideojsPlayer
            sources={[{
              src: '/media/ElephantsDream/stream.mpd',
              type: 'application/dash+xml'
            }
            ]}
          />
        </Grid>
      </div>
    )
  }
}
