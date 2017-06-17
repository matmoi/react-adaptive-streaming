import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavItem, Nav, NavDropdown, Navbar, MenuItem } from 'react-bootstrap'
import Sources from '../../sources.json'

export default class SourceSelector extends Component {

    constructor(...args) {
        super(...args)
        this.sources = Sources.sources
        this.state = {
            open: false,
            sourceIdx: 0
        }
    }

    render() {
        // const { supportedTypes } = this.props
        const listSources = this.sources.map((item, idx) =>
            <MenuItem key={idx} eventKey={ idx } active={idx === this.state.sourceIdx} onClick={() => this.setState({sourceIdx:idx})}>
                {item.src} {' '} <small><i>{item.type}</i></small>
            </MenuItem>
        )

        // const types = supportedTypes.map((type, idx) =>
        //     <option key={idx} value={type}>{type}</option>
        // )

        return (
            <Navbar fluid style={{width:"100%"}}>
                <Navbar.Header>
                    <Navbar.Brand>
                        Select stream
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Nav style={{width:"80%"}}>
                    <NavDropdown pullRight style={{width:"80%", textAlign: "right"}} title={this.sources[this.state.sourceIdx].src} id="source-selector-dropdown">
                        { listSources }
                    </NavDropdown>
                    <NavItem disabled><i>{this.sources[this.state.sourceIdx].type}</i></NavItem>
                    <NavItem style={{textAlign: "right"}} onSelect={this.props.onSubmit.bind(null,this.sources[this.state.sourceIdx])}>Submit</NavItem>
                </Nav>

            </Navbar>
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