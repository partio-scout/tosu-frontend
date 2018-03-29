
import React from 'react';
import TreeSelect, { TreeNode, SHOW_PARENT } from 'rc-tree-select';
import matchSorter from 'match-sorter';
//import 'react-select/dist/react-select.css';
import 'rc-tree-select/assets/index.css';
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
import filterOffExistingOnes from '../functions/searchBarFiltering';
import { gData } from '../utils/gData';
import { pink100 } from 'material-ui/styles/colors';

class TreeSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '0-0-0-value1'
        };
    }

    onSearch = (value) => {
        console.log(value, arguments);
    }

    onChange = (value) => {
        console.log('onChange', arguments);
        this.setState({ value });
    }


    filterTreeNode = (input, child) => {
        return String(child.props.title).indexOf(input) === 0;
    }

    onChangeChildren = (value) => {
        console.log('onChangeChildren', arguments);
        const pre = value ? this.state.value : undefined;
        this.setState({ value: isLeaf(value) ? value : pre });
    }

    render() {
        const { selectedActivity } = this.state;
        const value = selectedActivity && selectedActivity.value;
        const filteredPofActivities = filterOffExistingOnes(
            this.props.pofActivities,
            this.props.events,
            this.props.buffer
        )
        return (
            <div style={{ margin: 10, width: 800 }}>
                <TreeSelect
                    style={{ width: 300 }}
                    transitionName="rc-tree-select-dropdown-slide-up"
                    choiceTransitionName="rc-tree-select-selection__choice-zoom"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', backgroundColor: pink100 }}
                    placeholder={<i>placeholder</i>}
                    searchPlaceholder="please search"
                    showSearch allowClear treeLine
                    value={this.state.value}
                    treeData={gData}
                    treeNodeFilterProp="label"
                    filterTreeNode={this.filterTreeNode}
                    onChange={this.onChangeChildren}
                />
            </div>
        );
    }
}

function isLeaf(value) {
    if (!value) {
        return false;
    }
    let queues = [...gData];
    while (queues.length) { // BFS
        const item = queues.shift();
        if (item.value === value) {
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

function findPath(value, data) {
    const sel = [];
    function loop(selected, children) {
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            if (selected === item.value) {
                sel.push(item);
                return;
            }
            if (item.children) {
                loop(selected, item.children, item);
                if (sel.length) {
                    sel.push(item);
                    return;
                }
            }
        }
    }
    loop(value, data);
    return sel;
}


const mapStateToProps = (state) => {
    return {
        pofActivities: state.pofActivities,
        events: state.events,
        buffer: state.buffer
    }
}

export default connect(
    mapStateToProps,
    { notify, postActivityToBuffer }

)(TreeSearchBar)