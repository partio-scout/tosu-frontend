import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import Modal from '@material-ui/core/Modal'

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
      resource: null,
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
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  handleOpen = () => {
    this.setState({ isModalOpen: true });
  };

  handleClose = () => {
    this.setState({ isModalOpen: false });
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <div onClick={this.handleOpen}>
          <b>whatever for events</b>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isModalOpen}
          onClose={this.handleClose}
        >
          <div>
            <span>in popup</span>
          </div>
        </Modal>
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
          showMultiDayTimes
          components={{
            event: CustomEvent,
          }}
        />
      </div>
    )
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
