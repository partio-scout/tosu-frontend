import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import Modal from '@material-ui/core/Modal'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

function prepareEvents(events) {
  return events.map(event => {
    return {
      title: event.title,
      start: new Date(event.startDate + ' ' + event.startTime),
      end: new Date(event.endDate + ' ' + event.endTime),
      activities: event.activities,
      allDay: false,
    }
  })
}

function Event({ event }) {
  return (
    <div>
      <span>
        {event.title}
      </span><br/>
      {createActivityMarkers(event.activities)}
    </div>
  )
}

function createActivityMarkers(activities) {
  let markers = [' ']

  for (var i = 0; i < activities.length; i++) {
    markers.push(<span className="activity-marker" key={activities[i].id}></span>)
  }

  return markers
}

class CustomEvent extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isModalOpen: false
  //   }
  // }
  //
  // handleOpen = () => {
  //   this.setState({ isModalOpen: true })
  // }
  //
  // handleClose = () => {
  //   this.setState({ isModalOpen: false })
  // }
  // render() {
  //   const { classes } = this.props;
  //
  //   return (
  //     <div>
  //       <div onClick={this.handleOpen}>
  //         <b>whatever for events</b>
  //       </div>
  //       <Modal
  //         aria-labelledby="simple-modal-title"
  //         aria-describedby="simple-modal-description"
  //         open={this.state.isModalOpen}
  //         onClose={this.handleClose}
  //       >
  //         <div>
  //           <span>in popup</span>
  //         </div>
  //       </Modal>
  //     </div>
  //   );
  // }

  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
    }
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div>
        <div
          aria-owns={open ? 'simple-popper' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={this.handleClick}
        >
          Open Popover
        </div>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <strong>Content of the popover</strong>
        </Popover>
      </div>
    );
  }
}

export default class EventCalendar extends Component {

  render() {
    const { events } = this.props

    return (
      <div className="event-calendar">
        <BigCalendar
          popup
          localizer={localizer}
          events={prepareEvents(events)}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          showMultiDayTimes
          onSelectEvent={this.handleSelectEvent}
          components={{
            event: CustomEvent,
          }}
        />
      </div>
    )
  }

  handleSelectEvent(event,target) {
  	let obj = target.currentTarget;
    console.log(obj.getElementsByTagName('strong'))
    console.log(event)
    // obj.getElementsByTagName('strong')[0].click() // crashes but works for 1 second??
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isAddModalOpen: false,
  //     isEditModalOpen: false,
  //   };
  // }
  //
  // toggleAddModal = event => {
  //   if (!this.state.isEditModalOpen) {
  //     this.setState({
  //       currentEvent: event,
  //       isAddModalOpen: !this.state.isAddModalOpen,
  //     });
  //   }
  // };
  // toggleEditModal = event => {
  //   if (!this.state.isAddModalOpen) {
  //     this.setState({
  //       currentEvent: event,
  //       isEditModalOpen: !this.state.isEditModalOpen,
  //     });
  //   }
  // };
  // render() {
  //   const { events } = this.props
  //
  //   return (
  //     <div className="event-calendar">
  //       <BigCalendar
  //         selectable
  //         onSelectSlot={this.toggleAddModal}
  //         onSelectEvent={this.toggleEditModal}
  //         localizer={localizer}
  //         events={prepareEvents(events)}
  //         // Any other props you are using
  //       />
  //       <Modal
  //         aria-labelledby="simple-modal-title"
  //         aria-describedby="simple-modal-description"
  //         open={this.state.isEditModalOpen}
  //         onClose={this.toggleEditModal}
  //       >
  //         <div>
  //           <span>in popup</span>
  //         </div>
  //       </Modal>
  //       <Modal
  //         aria-labelledby="simple-modal-title"
  //         aria-describedby="simple-modal-description"
  //         open={this.state.isAddModalOpen}
  //         onClose={this.toggleAddModal}
  //
  //       >
  //         <div>
  //           <span>not in popup</span>
  //         </div>
  //       </Modal>
  //       // <Modal open={this.state.isAddModalOpen} toggle={this.toggleAddModal}>
  //       //     // whatever is displayed when you click the calendar
  //       // </Modal>
  //       // <Modal open={this.state.isEditModalOpen} toggle={this.toggleEditModal}>
  //       //     // whatever is displayed when you click an event
  //       //     <div>
  //       //       <span>in popup</span>
  //       //     </div>
  //       // </Modal>
  //     </div>
  //   );
  // }
}
