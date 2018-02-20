import React from 'react';
import { normalize, schema } from 'normalizr';

const createSchemas = () => {
  // Luo skeemat JSON datan normalisointia varten
  const taskSchema = new schema.Entity('tasks', {}, { idAttribute: 'guid' });

  const taskgroupSchema = new schema.Entity(
    'taskgroups',
    { tasks: [taskSchema] },
    { idAttribute: 'guid' }
  );

  taskgroupSchema.define({ taskgroups: [taskgroupSchema] });

  const agegroupSchema = new schema.Entity(
    'agegroups',
    {
      taskgroups: [taskgroupSchema]
    },
    { idAttribute: 'guid' }
  );

  const programSchema = new schema.Entity(
    'programs',
    {
      agegroups: [agegroupSchema]
    },
    { idAttribute: 'guid' }
  );

  const programListSchema = new schema.Array(programSchema);

  return programListSchema;
};

const activitiesArray = fetchedActivities => {
  if (!fetchedActivities) {
    console.log('No activities found yet!');
    return [];
  }

  const programListSchema = createSchemas();
  const normalizedData = normalize(
    fetchedActivities.program,
    programListSchema
  );

  // Hae haluttu ikäryhmä
  const tarpojat = Object.values(normalizedData.entities.agegroups)[3];

  // Hae ikäryhmän taskgroupit
  const taskgroupIDs = Object.values(tarpojat.taskgroups);

  // Hae taskgroupit ID:n perusteella
  const findTaskgroups = taskgroupIDs => {
    const taskgroups = taskgroupIDs.map(
      taskgroupID => normalizedData.entities.taskgroups[taskgroupID]
    );
    return taskgroups;
  };

  const taskgroups = findTaskgroups(taskgroupIDs);

  // Hae alitaskgroupit
  const findSubtaskgroups = taskgroup => {
    let subtaskgroups = [];
    if (taskgroup.taskgroups) {
      if (taskgroup.taskgroups.length !== 0) {
        subtaskgroups = findTaskgroups(Object.values(taskgroup.taskgroups));
      }
    }

    return subtaskgroups;
  };

  // Hae yksittäiset aktiviteetit

  const findTasks = taskIDs => {
    const tasks = taskIDs.map(taskID => normalizedData.entities.tasks[taskID]);
    return tasks;
  };

  // Luo Array kaikista taskgroupeista, subtaskgroupeista ja taskeista

  const getActivities = (taskgroups, activities) => {
    let foundActivities;
    for (let i = 0; i < taskgroups.length; i += 1) {
      const subtaskgroups = findSubtaskgroups(taskgroups[i]);

      if (subtaskgroups.length !== 0) {
        foundActivities = getActivities(subtaskgroups, activities);
      }

      const tasks = findTasks(Object.values(taskgroups[i].tasks));

      for (let j = 0; j < tasks.length; j += 1) {
        foundActivities.push(tasks[j]);
      }
    }

    return foundActivities;
  };

  // Hae kaikki aktiviteetteihin liittyvä tieto
  const activities = [];
  const taskArray = getActivities(taskgroups, activities);

  return taskArray;
};

const Activities = ({ fetchedActivities }) => {
  let activities = activitiesArray(fetchedActivities);
  activities = activities.map(activity => (
    <p key={activity.guid}>{activity.title}</p>
  ));
  return <div>{activities}</div>;
};

export default Activities;
export { activitiesArray };
