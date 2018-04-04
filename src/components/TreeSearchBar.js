
import React from 'react';
import TreeSelect/*, { TreeNode, SHOW_PARENT }*/ from 'rc-tree-select';
//import 'react-select/dist/react-select.css';
import 'rc-tree-select/assets/index.css';
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
//import SelectField from 'material-ui/SelectField';
//import MenuItem from 'material-ui/MenuItem';
import Select from 'react-select'
//import filterOffExistingOnes from '../functions/searchBarFiltering';
//import { gData } from '../utils/gData';
//import {  blue200, blue500 } from 'material-ui/styles/colors';


class TreeSearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTaskGroup: null,
            treePlaceHolder: 'Valitse ensin tarppo'
        }
    }

    onChange = (value) => {
        //console.log(value)
        //console.log('onChange', arguments);
        this.setState({ value });
    }


    filterTreeNode = (input, child) => {
        console.log(child)
        return child.props.title.props.name.toLowerCase().includes(input.toLowerCase())
    }

    onChangeChildren = async activityGuid => {
        if (this.isLeaf(activityGuid)) {
            await this.setState({ activityGuid })
            if (this.state.activityGuid) {
                this.activityToBuffer(activityGuid)
            }
        }
    };

    isLeaf = (value) => {
        if (!value) {
            return false;
        }
        let queues = [...this.props.pofTree.taskgroups];
        while (queues.length) { // BFS
            const item = queues.shift();
            if (item.value.toString() === value.toString()) {
                if (!item.children) {
                    return true;
                }
                return false;
            }
            if (item.children) {
                queues = queues.concat(item.children);
            }
        }
        return false;
    }

    onChangeTaskgroup = async (taskgroup) => {
        this.setState({ selectedTaskGroup: taskgroup })
        if (taskgroup === null) {
            this.setState({treePlaceHolder: 'Valitse ensin tarppo'})
            return
        }
        this.setState({treePlaceHolder: 'Lisää aktiviteetti'})
        const selectedGroup = this.props.pofTree.taskgroups.find(group => group.guid === taskgroup.value)
        const mandatoryActivities = selectedGroup.mandatory_tasks.split(',')
        const promises = mandatoryActivities.map(activity => (this.props.postActivityToBuffer({ guid: activity })))
        try {
            await Promise.all(promises)
            this.props.notify('Pakolliset aktiviteetit lisätty!', 'success')
        } catch (exception) {
            this.props.notify('Kaikki pakolliset aktiviiteetit eivät mahtuneet alueelle tai ovat jo lisätty!')
        }
    }

    render() {
        /* const filteredPofActivities = filterOffExistingOnes(
              this.props.pofActivities,
              this.props.events,
              this.props.buffer
          )*/
        const taskGroupTree = this.props.pofTree.taskgroups
        if (taskGroupTree === undefined) {
            return null
        }
        let selectedTaskGroupPofData = []
        if (this.state.selectedTaskGroup !== undefined && this.state.selectedTaskGroup !== null) {
            const groupfound = taskGroupTree.find(group => group.guid === this.state.selectedTaskGroup.value)
            selectedTaskGroupPofData=selectedTaskGroupPofData.concat(groupfound.children)
        }

        return (
            <div style={{ margin: 20 }}>
                <div style={{ float: 'left', marginRight: 20 }}>
                    <Select
                        menuContainerStyle={{ width: 200 }}
                        style={{ width: 200 }}
                        name="form-field-name"
                        value={this.state.selectedTaskGroup}
                        onChange={this.onChangeTaskgroup}
                        options={taskGroupTree.map(rootgroup => {
                            return { value: rootgroup.guid, label: rootgroup.title }
                        })}
                    />
                </div>
                <TreeSelect
                    style={{ width: 300 }}
                    transitionName="rc-tree-select-dropdown-slide-up"
                    choiceTransitionName="rc-tree-select-selection__choice-zoom"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder={this.state.treePlaceHolder}
                    searchPlaceholder="Search..."
                    showSearch allowClear treeLine
                    value={this.state.value}
                    treeData={selectedTaskGroupPofData}
                    treeNodeFilterProp="label"
                    filterTreeNode={this.filterTreeNode}
                    onChange={this.onChangeChildren}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        events: state.events,
        buffer: state.buffer,
        pofTree: state.pofTree
    }
}

export default connect(
    mapStateToProps,
    { notify, postActivityToBuffer }

)(TreeSearchBar)