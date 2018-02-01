import React from "react";
import { normalize, schema } from "normalizr";
import originalData from "../partio.json";

const taskSchema = new schema.Entity("tasks", {}, { idAttribute: "guid" });

const taskgroupSchema = new schema.Entity(
  "taskgroups",
  { tasks: [taskSchema] },
  { idAttribute: "guid" }
);

taskgroupSchema.define({ taskgroups: [taskgroupSchema] });

const agegroupSchema = new schema.Entity(
  "agegroups",
  {
    taskgroups: [taskgroupSchema]
  },
  { idAttribute: "guid" }
);

const programSchema = new schema.Entity(
  "programs",
  {
    agegroups: [agegroupSchema]
  },
  { idAttribute: "guid" }
);

const programListSchema = new schema.Array(programSchema);

const normalizedData = normalize(originalData.program, programListSchema);

//Hae haluttu ikäryhmä
const tarpojat = Object.values(normalizedData.entities.agegroups)[4];

//Hae ikäryhmän taskgroupit
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

// Tulosta kaikki yhden ryhmän aktiviteettikategoriat ja aktiviteetit

const getActivities = (taskgroups, activities) => {
  for (let i in taskgroups) {
    activities = activities.concat("<li>", taskgroups[i].title, "<ul>");


    const subtaskgroups = findSubtaskgroups(taskgroups[i]);
    
    if (subtaskgroups.length !== 0) {
     activities = getActivities(subtaskgroups, activities);
    }

    const tasks = findTasks(Object.values(taskgroups[i].tasks));

    for (let j in tasks) {
      activities = activities.concat("<li>", tasks[j].title, "</li>");
    }

    activities = activities.concat("</ul></li>");
  }

  return activities;
};

let activities = "<ul>";
const activitiesString = getActivities(taskgroups, activities);
activities = activities.concat("</ul>");

function createHtml() {
  return { __html: activitiesString };
}

const Activities = () => (
  <div>
    <h3>{tarpojat.title}</h3>
    <div dangerouslySetInnerHTML={createHtml()} />
  </div>
);

export default Activities;
