export function getTasks(userEmail) {
  const data = localStorage.getItem(`tasks_${userEmail}`)
  return data ? JSON.parse(data) : []
}

export function saveTasks(userEmail, tasks) {
  localStorage.setItem(`tasks_${userEmail}`, JSON.stringify(tasks))
}

export function addTask(userEmail, task) {
  const tasks = getTasks(userEmail)
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    done: false
  }
  tasks.push(newTask)
  saveTasks(userEmail, tasks)
  return newTask
}

export function deleteTask(userEmail, taskId) {
  const tasks = getTasks(userEmail).filter(t => t.id !== taskId)
  saveTasks(userEmail, tasks)
}

export function toggleTask(userEmail, taskId) {
  const tasks = getTasks(userEmail).map(t =>
    t.id === taskId ? { ...t, done: !t.done } : t
  )
  saveTasks(userEmail, tasks)
  return tasks
}