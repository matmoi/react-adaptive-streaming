import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InputGroup, Row, Col, ButtonGroup, DropdownButton, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, MenuItem } from 'react-bootstrap'
import Sources from '../../sources.json'

export default class SourceSelector extends Component {

    constructor(...args) {
        super(...args)
        this.sources = Sources.sources
        this.state = {
            open: false,
            useVideojs: false,
            source:undefined,
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

    submitNewSource() {
        this.props.onSubmit(this.state.source,this.state.type, this.state.useVideojs)
    }

    render() {
        // const { supportedTypes } = this.props
        const listSources = this.sources.map((item, idx) =>
            <MenuItem key={idx} eventKey={idx} active={item.src === this.state.source && item.type === this.state.type} onClick={() => this.setState({ source: this.sources[idx].src, type: this.sources[idx].type })}>
                {item.src} {' '} <small><i>{item.type}</i></small>
            </MenuItem>
        )

        // const types = supportedTypes.map((type, idx) =>
        //     <option key={idx} value={type}>{type}</option>
        // )

        return (
            <Row className="show-grid">
                <Col md={1}>
                    Stream url:
                </Col>
                <Col md={8}>
                <FormGroup>
                    <InputGroup>
                        <DropdownButton componentClass={InputGroup.Button} id="input-dropdown-addon" title="">
                            {listSources}
                        </DropdownButton>
                        <FormControl type="text" value={this.state.source} onChange={(e) => this.setState({source: e.target.value})}/>
                    </InputGroup>
                </FormGroup>
                </Col>
                <Col md={1}>
                    <small><i>{this.state.type}</i></small>
                </Col>
                <Col md={1}>
                    <Checkbox checked={this.state.useVideojs} onChange={() => this.setState({ useVideojs: !this.state.useVideojs })}>Videojs</Checkbox>
                </Col>
                <Col md={1}>
                    <Button bsStyle="primary" type="submit" onClick={() => this.submitNewSource()}>
                        Load
                    </Button>
                </Col>
            </Row>
            // <Navbar fluid style={{ width: "100%" }}>
            //     <Navbar.Header>
            //         <Navbar.Brand>
            //             Select stream
            //         </Navbar.Brand>
            //         <Navbar.Toggle />
            //     </Navbar.Header>
            //     <Nav style={{ width: "80%" }}>
            //         <NavDropdown pullRight style={{ width: "70%", textAlign: "right" }} title={this.sources[this.state.sourceIdx].src} id="source-selector-dropdown">
            //             {listSources}
            //         </NavDropdown>
            //         <NavItem disabled><i>{this.sources[this.state.sourceIdx].type}</i></NavItem>
            //         <NavItem style={{ textAlign: "right" }} onSelect={this.props.onSubmit.bind(null, this.sources[this.state.sourceIdx], this.state.useVideojs)}>Submit</NavItem>
            //     </Nav>
            //     <Checkbox style={{ textAlign: "right" }} checked={this.state.useVideojs} onChange={() => this.setState({ useVideojs: !this.state.useVideojs })}>Videojs</Checkbox>
            // </Navbar>
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