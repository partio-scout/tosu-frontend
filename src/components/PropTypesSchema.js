import PropTypes from 'prop-types'
// check "event:", twice, different types
const PropTypesSchema = {
  PropTypesCommon: PropTypes.shape({
    // Several files
    pofTreeUpdate: PropTypes.func.isRequired,
    taskgroup: PropTypes.shape({
      value: PropTypes.number.isRequired,
    }),
    buffer: PropTypes.shape({
      activities: PropTypes.arrayOf(PropTypes.object).isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
    parentId: PropTypes.number.isRequired,
    notify: PropTypes.func.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    children: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    className: PropTypes.string.isRequired,
    odd: PropTypes.bool.isRequired,
    deleteActivityFromBuffer: PropTypes.func.isRequired,
    pofActivity: PropTypes.shape({}).isRequired,
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.object.isRequired,
      startDate: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      kuksaEventId: PropTypes.number.isRequired,
      synced: PropTypes.bool.isRequired,
      activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    scout: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    classes: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }).isRequired,
    mobile: PropTypes.bool.isRequired,
    closePopper: PropTypes.func.isRequired,
    setNotification: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    minimal: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      synced: PropTypes.bool,
      eventGroupId: PropTypes.number,
      kuksaEvent: PropTypes.object,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      information: PropTypes.string.isRequired,
    }).isRequired,
    editEvent: PropTypes.func.isRequired,
    bufferZoneInitialization: PropTypes.func.isRequired,
    filter: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    activity: PropTypes.shape({}).isRequired,
    isDragging: PropTypes.bool.isRequired,
    deleteActivity: PropTypes.func.isRequired,
    addStatusMessage: PropTypes.func.isRequired,
    emptyTaskgroup: PropTypes.func.isRequired,
    pofTree: PropTypes.shape({
      taskgroups: PropTypes.arrayOf(PropTypes.object).isRequired,
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    selectTaskgroup: PropTypes.func.isRequired,
    savedActivity: PropTypes.shape({}).isRequired,
    deletePlan: PropTypes.func.isRequired,

    // PlanForm.js
    // none
    // Activity.js
    // none
    // Activities.js
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    bufferzone: PropTypes.bool.isRequired,
    deleteActivityFromEvent: PropTypes.func.isRequired,
    // EventCard.js
    addActivityToEventOnlyLocally: PropTypes.func.isRequired,
    // BufferZone
    // none
    // ActivityDragAndDropTarget.js
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    // Notification.js
    notification: PropTypes.shape({
      text: PropTypes.string.isRequired,
      textType: PropTypes.string.isRequired,
    }).isRequired,
    //ButtonRow.js
    viewChange: PropTypes.func.isRequired,
    dateRangeUpdate: PropTypes.func.isRequired,
    newEvent: PropTypes.func.isRequired,
    // StatusMessage.js
    showStatusBox: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    statusMessage: PropTypes.shape({}).isRequired,
    // Login.js
    scoutGoogleLogin: PropTypes.func.isRequired,
    eventsInitialization: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    // AccountIcon.js
    scoutLogout: PropTypes.func.isRequired,
    mobileFeedback: PropTypes.func.isRequired,
    accountIcon: PropTypes.shape({}).isRequired,
    // TreeSearchBar.js
    postActivityToBuffer: PropTypes.func.isRequired,
    // NewEvent.js
    closeMe: PropTypes.func.isRequired,
    addEvent: PropTypes.func.isRequired,
    // ActivityPreview
    currentOffset: PropTypes.number.isRequired,
    startPoint: PropTypes.number.isRequired,
    // AddToPlan
    addEventFromKuksa: PropTypes.func.isRequired,
    buttonClass: PropTypes.string.isRequired,
    // AppBar.js
    toggleSideBar: PropTypes.func.isRequired,
    // Calendar.js
    shouldShowKuksaEventsAlso: PropTypes.bool.isRequired,
    // CalendarEvent.js
    openPopper: PropTypes.func.isRequired,
    popperOpen: PropTypes.bool.isRequired,
    // CalendarToolbar.js
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.shape({}).isRequired,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    switchState: PropTypes.bool.isRequired,
    hideKuksaEvents: PropTypes.bool.isRequired,
    showKuksaEvents: PropTypes.bool.isRequired,
    // DeleteEvent.js
    deleteSyncedEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventGroup: PropTypes.func.isRequired,
    // EditEvent.js
    // none
    // EventForm.js
    update: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    allowRepeatedEvent: PropTypes.bool.isRequired,
    submitFunction: PropTypes.func.isRequired,
    // EventList.js
    // none
    // MobileActivity
    connectDragPreview: PropTypes.func.isRequired,
    // MobileAppBar
    setHeaderHeight: PropTypes.func.isRequired,
    headerVisible: PropTypes.bool.isRequired,
    // PlanCard.js
    initPlans: PropTypes.func.isRequired,
    savePlan: PropTypes.func.isRequired,
    plans: PropTypes.arrayOf(PropTypes.object).isRequired,
    suggestion: PropTypes.shape({}).isRequired,
    // FeedbackButton.js
    feedback_url: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
  }),
}

export default PropTypesSchema
