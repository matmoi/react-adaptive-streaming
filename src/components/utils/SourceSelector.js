import React, { Component } from 'react'
import { Button, Panel, Navbar, FormGroup, FormControl, MenuItem, DropdownButton } from 'react-bootstrap'
import Sources from '../../sources.json'

export default class SourceSelector extends Component {

    constructor(...args) {
        super(...args)
        this.sources = Sources.sources
        this.state = {
            open: false,
            src: this.sources[0].src,
            type: this.sources[0].type
        }
    }

    updateSelectedSource(e) {
        console.log(e)
        // this.setState({
        //     ...e
        // })
    }

    render() {
        const listSources = this.sources.map((item, idx) =>
            <MenuItem key={idx} eventKey={{ ...item }}><span>{item.src}</span><span>{item.type}</span></MenuItem>
        )

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        Select stream
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Navbar.Form pullLeft>
                        <FormGroup>
                            <FormControl type="text" placeholder="src" value={this.state.src} onSelect={(e)=>this.setState({open:true})}/>
                            type: 
                            <FormControl componentClass="select" placeholder="select">
                                <option value="application/dash+xml">application/dash+xml</option>
                            </FormControl>
                        </FormGroup>
                        {' '}
                        <Button type="submit">Submit</Button>
                    </Navbar.Form>
                </Navbar.Collapse>
                <Panel collapsible expanded={this.state.open}>
                    {listSources}
                </Panel>
            </Navbar>

            // <DropdownButton id={"Select source"} title={`${this.state.src} ${this.state.type}`} onSelect={e => this.updateSelectedSource(e)}>
            //     {listSources}
            // </DropdownButton>
        )
    }
}
