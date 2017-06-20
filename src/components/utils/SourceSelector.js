import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InputGroup, Row, Col, DropdownButton, Button, FormGroup, FormControl, Checkbox, MenuItem } from 'react-bootstrap'
import Sources from '../../sources.json'

export default class SourceSelector extends Component {

    constructor(...args) {
        super(...args)
        this.sources = Sources.sources
        this.state = {
            useVideojs: false,
            source:"",
            type:undefined
        }
    }

    componentDidMount() {
        if (this.sources.length > 0) { //on init, take the first of the json list in sources as default
            this.props.onSubmit(this.sources[0].src,this.sources[0].type,this.state.useVideojs)
            this.setState({
                source:this.sources[0].src,
                type:this.sources[0].type
            })
        }
    }

    render() {
        const { supportedTypes } = this.props
        const listSources = this.sources.map((item, idx) =>
            <MenuItem key={idx} eventKey={idx} active={item.src === this.state.source && item.type === this.state.type} onClick={() => this.setState({ source: this.sources[idx].src, type: this.sources[idx].type })}>
                {item.src} {' '} <small><i>{item.type}</i></small>
            </MenuItem>
        )

        return (
            <Row className="show-grid">
                <Col md={1}>
                </Col>
                <Col md={7}>
                <FormGroup>
                    <InputGroup>
                        <DropdownButton componentClass={InputGroup.Button} id="input-dropdown-addon" title="Examples">
                            {listSources}
                        </DropdownButton>
                        <FormControl type="text" value={this.state.source} onChange={(e) => this.setState({source: e.target.value})}/>
                    </InputGroup>
                </FormGroup>
                </Col>
                <Col md={2}>
                    <FormControl componentClass="select" onChange={(e) => this.setState({type: e.target.value})} value={this.state.type}>
                        { supportedTypes.map((type, idx) =>
                            <option key={idx} value={type}>{type}</option>
                        )}
                    </FormControl>
                </Col>
                <Col md={1}>
                    <Checkbox checked={this.state.useVideojs} onChange={() => this.setState({ useVideojs: !this.state.useVideojs })}>Videojs</Checkbox>
                </Col>
                <Col md={1}>
                    <Button bsStyle="primary" type="submit" onClick={() => this.props.onSubmit(this.state.source,this.state.type, this.state.useVideojs)}>
                        Load
                    </Button>
                </Col>
            </Row>
        )
    }
}

SourceSelector.propTypes = {
    supportedTypes: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func
}

SourceSelector.defaultProps = {
    supportedTypes: [
        "application/dash+xml",   //DASH
        "application/x-mpegURL",  //HLS
        "video/mp4"
    ]
}