import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const STORAGE_KEY = 'reacty-sr-quick-tasks'
const TASK_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

const getStoredTasks = () => {
  try {
    const rawTasks = localStorage.getItem(STORAGE_KEY)
    const parsedTasks = rawTasks ? JSON.parse(rawTasks) : []

    if (!Array.isArray(parsedTasks)) {
      return []
    }

    return parsedTasks.filter(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.text === 'string' &&
        typeof task.done === 'boolean',
    )
  } catch {
    return []
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState(() => getStoredTasks())
  const [taskFilter, setTaskFilter] = useState(TASK_FILTERS.ALL)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (event) => {
    event.preventDefault()
    const trimmedInput = taskInput.trim()

    if (!trimmedInput) {
      return
    }

    setTasks((prevTasks) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: trimmedInput,
        done: false,
      },
      ...prevTasks,
    ])
    setTaskInput('')
  }

  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    )
  }

  const removeTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const clearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.done))
  }

  const completedTasks = tasks.filter((task) => task.done).length
  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === TASK_FILTERS.ACTIVE) {
      return !task.done
    }

    if (taskFilter === TASK_FILTERS.COMPLETED) {
      return task.done
    }

    return true
  })

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <section id="quick-tasks" aria-labelledby="quick-tasks-title">
        <div className="quick-tasks-header">
          <h2 id="quick-tasks-title">Quick tasks</h2>
          <p>Track a few things while you build.</p>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="task-input">
            Add a task
          </label>
          <input
            id="task-input"
            className="task-input"
            type="text"
            value={taskInput}
            placeholder="Add a small task"
            onChange={(event) => setTaskInput(event.target.value)}
          />
          <button className="task-action" type="submit">
            Add
          </button>
        </form>

        <p className="task-meta">
          {completedTasks}/{tasks.length} completed
        </p>

        <div className="task-filters" role="group" aria-label="Filter tasks">
          <button
            type="button"
            className={
              taskFilter === TASK_FILTERS.ALL
                ? 'task-filter task-filter-active'
                : 'task-filter'
            }
            onClick={() => setTaskFilter(TASK_FILTERS.ALL)}
          >
            All
          </button>
          <button
            type="button"
            className={
              taskFilter === TASK_FILTERS.ACTIVE
                ? 'task-filter task-filter-active'
                : 'task-filter'
            }
            onClick={() => setTaskFilter(TASK_FILTERS.ACTIVE)}
          >
            Active
          </button>
          <button
            type="button"
            className={
              taskFilter === TASK_FILTERS.COMPLETED
                ? 'task-filter task-filter-active'
                : 'task-filter'
            }
            onClick={() => setTaskFilter(TASK_FILTERS.COMPLETED)}
          >
            Completed
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="task-empty">No tasks yet. Add your first one.</p>
        ) : filteredTasks.length === 0 ? (
          <p className="task-empty">No tasks in this filter.</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                <label className="task-check">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className={task.done ? 'task-text task-text-done' : 'task-text'}>
                    {task.text}
                  </span>
                </label>
                <button
                  type="button"
                  className="task-remove"
                  onClick={() => removeTask(task.id)}
                  aria-label={`Remove task ${task.text}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {completedTasks > 0 && (
          <button type="button" className="task-clear" onClick={clearCompleted}>
            Clear completed
          </button>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
