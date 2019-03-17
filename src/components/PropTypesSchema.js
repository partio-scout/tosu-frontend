import PropTypes from 'prop-types'
// check "event:", twice, different types
const PropTypesSchema = {
  PropTypesCommon: PropTypes.shape({
    // Several files
    pofTreeUpdate: PropTypes.func,
    taskgroup: PropTypes.shape({
      value: PropTypes.number,
    }),
    buffer: PropTypes.shape({
      activities: PropTypes.arrayOf(PropTypes.object),
      id: PropTypes.number,
    }),
    parentId: PropTypes.number,
    notify: PropTypes.func,
    events: PropTypes.arrayOf(PropTypes.shape({})),
    children: PropTypes.arrayOf(PropTypes.shape({})),
    className: PropTypes.string,
    odd: PropTypes.bool,
    deleteActivityFromBuffer: PropTypes.func,
    pofActivity: PropTypes.shape({}),
    event: PropTypes.shape({
      id: PropTypes.number,
      type: PropTypes.object,
      startDate: PropTypes.string,
      startTime: PropTypes.string,
      endDate: PropTypes.string,
      endTime: PropTypes.string,
      title: PropTypes.string,
      kuksaEventId: PropTypes.number,
      synced: PropTypes.bool,
      activities: PropTypes.arrayOf(PropTypes.object),
    }),
    scout: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    classes: PropTypes.shape({
      label: PropTypes.string,
    }),
    mobile: PropTypes.bool,
    closePopper: PropTypes.func,
    setNotification: PropTypes.func,
    view: PropTypes.string,
    minimal: PropTypes.bool,
    data: PropTypes.shape({
      id: PropTypes.number,
      synced: PropTypes.bool,
      eventGroupId: PropTypes.number,
      kuksaEvent: PropTypes.object,
      type: PropTypes.string,
      title: PropTypes.string,
      startDate: PropTypes.string,
      startTime: PropTypes.string,
      endDate: PropTypes.string,
      endTime: PropTypes.string,
      information: PropTypes.string,
    }),
    editEvent: PropTypes.func,
    bufferZoneInitialization: PropTypes.func,
    filter: PropTypes.bool,
    connectDragSource: PropTypes.func,
    activity: PropTypes.shape({}),
    isDragging: PropTypes.bool,
    deleteActivity: PropTypes.func,
    addStatusMessage: PropTypes.func,
    emptyTaskgroup: PropTypes.func,
    pofTree: PropTypes.shape({
      taskgroups: PropTypes.arrayOf(PropTypes.object),
      children: PropTypes.arrayOf(PropTypes.object),
    }),
    selectTaskgroup: PropTypes.func,
    savedActivity: PropTypes.shape({}),
    deletePlan: PropTypes.func,

    // PlanForm.js
    // none
    // Activity.js
    // none
    // Activities.js
    activities: PropTypes.arrayOf(PropTypes.object),
    bufferzone: PropTypes.bool,
    deleteActivityFromEvent: PropTypes.func,
    // EventCard.js
    addActivityToEventOnlyLocally: PropTypes.func,
    // BufferZone
    // none
    // ActivityDragAndDropTarget.js
    isOver: PropTypes.bool,
    canDrop: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    // Notification.js
    notification: PropTypes.shape({
      text: PropTypes.string,
      textType: PropTypes.string,
    }),
    //ButtonRow.js
    viewChange: PropTypes.func,
    dateRangeUpdate: PropTypes.func,
    newEvent: PropTypes.func,
    // StatusMessage.js
    showStatusBox: PropTypes.bool,
    handleClose: PropTypes.func,
    handleOpen: PropTypes.func,
    statusMessage: PropTypes.shape({}),
    // Login.js
    scoutGoogleLogin: PropTypes.func,
    eventsInitialization: PropTypes.func,
    token: PropTypes.string,
    // AccountIcon.js
    scoutLogout: PropTypes.func,
    mobileFeedback: PropTypes.func,
    accountIcon: PropTypes.shape({}),
    // TreeSearchBar.js
    postActivityToBuffer: PropTypes.func,
    // NewEvent.js
    closeMe: PropTypes.func,
    addEvent: PropTypes.func,
    // ActivityPreview
    currentOffset: PropTypes.number,
    startPoint: PropTypes.number,
    // AddToPlan
    addEventFromKuksa: PropTypes.func,
    buttonClass: PropTypes.string,
    // AppBar.js
    toggleSideBar: PropTypes.func,
    // Calendar.js
    shouldShowKuksaEventsAlso: PropTypes.bool,
    // CalendarEvent.js
    openPopper: PropTypes.func,
    popperOpen: PropTypes.bool,
    // CalendarToolbar.js
    views: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.node,
    messages: PropTypes.shape({}),
    onNavigate: PropTypes.func,
    onViewChange: PropTypes.func,
    switchState: PropTypes.bool,
    hideKuksaEvents: PropTypes.bool,
    showKuksaEvents: PropTypes.bool,
    // DeleteEvent.js
    deleteSyncedEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    deleteEventGroup: PropTypes.func,
    // EditEvent.js
    // none
    // EventForm.js
    update: PropTypes.func,
    close: PropTypes.func,
    allowRepeatedEvent: PropTypes.bool,
    submitFunction: PropTypes.func,
    // EventList.js
    // none
    // MobileActivity
    connectDragPreview: PropTypes.func,
    // MobileAppBar
    setHeaderHeight: PropTypes.func,
    headerVisible: PropTypes.bool,
    // PlanCard.js
    initPlans: PropTypes.func,
    savePlan: PropTypes.func,
    plans: PropTypes.arrayOf(PropTypes.object),
    suggestion: PropTypes.shape({}),
    // FeedbackButton.js
    feedback_url: PropTypes.string,
    visible: PropTypes.bool,
  }),
}

export default PropTypesSchema
