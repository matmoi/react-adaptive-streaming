import React from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import { Panel, Button, ButtonGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class DropdownPanel extends React.Component {

    constructor(...args) {
        super(...args)
        this.state = {
            open: true
        }
    }

    render() {
        const { title, data } = this.props
        return (
            <ButtonGroup vertical block>
                {data ?
                    <Button onClick={() => this.setState({ open: !this.state.open })} bsStyle="primary">{title+ ' '}<FontAwesome name={this.state.open ? 'chevron-up' : 'chevron-down'}/></Button>
                    :
                    <Button disabled bsStyle="primary">{title}</Button>
                }
                {data &&
                    <Panel collapsible expanded={this.state.open} bsClass="custom-panel">
                        <JSONTree hideRoot={true} data={{
                            ...data
                        }} />
                    </Panel>
                }
            </ButtonGroup>
        )
    }
}

DropdownPanel.propTypes = {
    data: PropTypes.object,
    title: PropTypes.string.isRequired
};

DropdownPanel.defaultProps = {
    data: {}
}