
import React from 'react';
import TreeSelect/*, { TreeNode, SHOW_PARENT }*/ from 'rc-tree-select';
//import 'react-select/dist/react-select.css';
import 'rc-tree-select/assets/index.css';
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Select from 'react-select'
//import filterOffExistingOnes from '../functions/searchBarFiltering';
//import { gData } from '../utils/gData';
//import {  blue200, blue500 } from 'material-ui/styles/colors';


class TreeSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTaskGroup: null
        };
    }

    onSearch = (value) => {
        //console.log(value, arguments);
    }

    onChange = (value) => {
        //console.log(value)
        //console.log('onChange', arguments);
        this.setState({ value });
    }


    filterTreeNode = (input, child) => {
        return child.props.title.toLowerCase().includes(input.toLowerCase())
    }

    onChangeChildren = async activityGuid => {
        if (this.isLeaf(activityGuid)) {
            await this.setState({ activityGuid })
            if (this.state.activityGuid) {
                const data = {
                    guid: activityGuid
                }
                try {
                    await this.props.postActivityToBuffer(data)
                    this.setState({ activityGuid: null })
                    this.props.notify('Aktiviteetti lisätty!', 'success')
                } catch (Exception) {
                    this.props.notify('Aktiviteettialue on täynnä tai aktiviteetti on jo lisätty!')
                }
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

    onChangeTaskgroup = async taskgroupId => {
        //console.log(taskgroupId)
    }

    addMandatoryActivitiesFromTarppoToBufferzone = async (pofTree, selectedTaskGroup) => {
        //const mandatoryActivities = pofTree.taskgroups.mandatory_tasks
        
        
        
        try {
            const mandatoryActivities = pofTree.taskgroups.find(group => group.guid === selectedTaskGroup).mandatory_tasks
            await console.log('TASK' ,pofTree.taskgroups)
            console.log('wut', pofTree )
            console.log('man', mandatoryActivities)
            await Promise.all([
                
            ]) 
        } catch (exception) {
            console.log('virhe')
            //this.props.notify('')
        }
    }
    

    render() {
        this.addMandatoryActivitiesFromTaskgroupToBufferzone(this.pofTree, this.state.selectedTaskGroup)
        /* const filteredPofActivities = filterOffExistingOnes(
              this.props.pofActivities,
              this.props.events,
              this.props.buffer
          )*/
        const filteredPofActivities = this.props.pofTree.taskgroups
        if (filteredPofActivities === undefined) {
            return null
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

                        options={filteredPofActivities.map(rootgroup => {
                            //console.log(rootgroup)
                            let obj = {}
                            obj = { value: rootgroup.guid, label: rootgroup.title }
                            return obj
                        })}

                    />
                </div>

                <TreeSelect
                    style={{ width: 300 }}
                    transitionName="rc-tree-select-dropdown-slide-up"
                    choiceTransitionName="rc-tree-select-selection__choice-zoom"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder={'Lisää aktiviteetti'}
                    searchPlaceholder="Search..."
                    showSearch allowClear treeLine
                    value={this.state.value}
                    treeData={filteredPofActivities}
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