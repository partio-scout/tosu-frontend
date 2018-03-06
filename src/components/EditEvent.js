import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import eventService from '../services/events';
import eventgroupService from '../services/eventgroups';
import moment from 'moment';
import FrequentEventsHandler from '../utils/FrequentEventsHandler';
import EventForm from './EventForm';

export default class NewEvent extends React.Component {
    constructor(props) {
        super(props);
        const event = this.props.data
        let newStartTime = moment(event.startDate + ' ' + event.startTime, "YYYY-MM-DD HH:mm")
        let newEndTime = moment(event.endDate + ' ' + event.endTime, "YYYY-MM-DD HH:mm")
        console.log(newStartTime)
        this.state = {
            title: event.title,
            startDate: new Date(event.startDate),
            startTime: newStartTime.toDate(),
            endDate: new Date(event.endDate),
            endTime: newEndTime.toDate(),
            checked: false,
            repeatCount: 1,
            repeatFrequency: 0,
            type: event.type,
            information: event.information
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({
            open: false,
            title: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            checked: false,
            repeatCount: 1,
            repeatFrequency: 0,
            type: '',
            information: ''
        });
    };

    handleCloseAndSend = () => {
        console.log('muokataan muokataan...')
    }

    sendGroupIdPostRequest = async () => {
        try {
            const groupId = await eventgroupService.create();
            return groupId;
        } catch (exception) {
            console.error('Error in event POST:', exception);
        }
    }

    sendEventPostRequest = async data => {
        try {
            await eventService.create(data);
        } catch (exception) {
            console.error('Error in event POST:', exception);
        }
    }

    update = (title, startDate, startTime, endDate, endTime, checked, repeatCount, repeatFrequency, type, information) => {
        this.setState({
            title: title,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            checked: checked,
            repeatCount: repeatCount,
            repeatFrequency: repeatFrequency,
            type: type,
            information: information
        })
    }

    render() {

        return (
            <div>
                <RaisedButton label="Muokkaa" onClick={this.handleOpen} className={this.props.buttonClass}/>
                <Dialog
                    title="Muokkaa tapahtumaa"
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent
                >
                    <EventForm submitFunction={this.handleCloseAndSend.bind(this)} close={this.handleClose.bind(this)} update={this.update.bind(this)} data={this.state} />
                </Dialog>
            </div>
        );
    }
}
