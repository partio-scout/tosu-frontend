
import React from 'react';
import TreeSelect/*, { TreeNode, SHOW_PARENT }*/ from 'rc-tree-select';
import 'rc-tree-select/assets/index.css';
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import Select from 'react-select'


class TreeSearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTaskGroup: null,
            treePlaceHolder: 'Valitse ensin tarppo'
        }
    }

    onChange = (value) => {
        this.setState({ value });
    }

    filterTreeNode = (input, child) => {
        return child.props.title.props.name.toLowerCase().includes(input.toLowerCase())
    }

    onChangeChildren = async activityGuid => {
        if (this.isLeaf(activityGuid)) {
            try {
                await this.props.postActivityToBuffer({ guid: activityGuid })
                this.props.notify('Aktiviteetti on lisätty!', 'success')
            } catch (exception) {
                this.props.notify('Aktiviteettialue on täynnä!!')
            }
        }
        this.props.pofTreeUpdate(this.props.buffer, this.props.events)
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
            this.setState({ treePlaceHolder: 'Valitse ensin tarppo' })
            return
        }
        this.setState({ treePlaceHolder: 'Lisää aktiviteetti' })
        const selectedGroup = this.props.pofTree.taskgroups.find(group => group.guid === taskgroup.value)
        const mandatoryActivities = selectedGroup.mandatory_tasks.split(',')
        if (mandatoryActivities[0] !== "") {//empty split return and array with only value as ""                        
            
            let activities = []
            this.props.buffer.activities.forEach(activity => {
              activities = activities.concat(activity.guid)
            });
            this.props.events.forEach(event => {
              event.activities.forEach(activity => {
                activities = activities.concat(activity.guid)
              })
            })
            console.log("all activities:", activities)                       
            console.log("before", mandatoryActivities)


            const promises = mandatoryActivities.map(activity => {

                
                return (activities.includes(activity) ? null : this.props.postActivityToBuffer({ guid: activity }))
            })
            console.log("promises", promises)
            try {
                await Promise.all(promises)
                this.props.notify('Pakolliset aktiviteetit lisätty tai olemassa!', 'success')
            } catch (exception) {
                    this.props.notify('Kaikki pakolliset aktiviiteetit eivät mahtuneet alueelle tai ovat jo lisätty!')
            }
        }
            this.props.pofTreeUpdate(this.props.buffer, this.props.events)
    }   

    render() {
        const taskGroupTree = this.props.pofTree.taskgroups
        if (taskGroupTree === undefined) {
            return null
        }
        let selectedTaskGroupPofData = []
        if (this.state.selectedTaskGroup !== undefined && this.state.selectedTaskGroup !== null) {
            const groupfound = taskGroupTree.find(group => group.guid === this.state.selectedTaskGroup.value)
            selectedTaskGroupPofData = selectedTaskGroupPofData.concat(groupfound.children)
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
    { notify, postActivityToBuffer, pofTreeUpdate }

)(TreeSearchBar)