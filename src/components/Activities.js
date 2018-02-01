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

const findSubtaskgroups = (taskgroup) => {
  let subtaskgroups = []
  for (let i in taskgroups) {
    if (taskgroups[i].taskgroups.length !== 0) {
      subtaskgroups = subtaskgroups.concat({owner: taskgroups[i].guid}, {taskgroups: (findTaskgroups(Object.values(taskgroups[i].taskgroups)))})
    } 
  }

  return subtaskgroups
}

const subtaskgroups = findSubtaskgroups(taskgroups)

const findTasks = taskIDs => {
  const tasks = taskIDs.map(taskID => normalizedData.entities.tasks[taskID])
  return tasks
}

const getActivities = (taskgroups) =>{
  for(let i in taskgroups) {
    console.log(taskgroups[i].title)
    const subtaskgroups = findSubtaskgroups(taskgroups[i])
  }

}

const activities = getActivities(taskgroups)

const Activities = () => (
  <div>
    <h3>{tarpojat.title}</h3>
    <pre>{activities}</pre>
  </div>
);

export default Activities;
