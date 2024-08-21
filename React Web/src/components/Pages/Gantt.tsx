import React, { useState, useEffect } from 'react';
import Timeline from 'react-gantt-timeline';
import CustomNavbar from '../Common/Navbar';
import UserSidebar from '../Common/UserSidebar';
import '../../App.css';

interface Task {
  id: number;
  start: Date;
  end: Date;
  name: string;
}

function Gantt() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [newTask, setNewTask] = useState({
    name: '',
    start: '',
    end: '',
  });

  useEffect(() => {
    // Charger les tâches depuis le localStorage au chargement du composant
    const storedTasks = localStorage.getItem('ganttTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        start: new Date(task.start),
        end: new Date(task.end),
      })));
    }
  }, []);

  useEffect(() => {
    // Sauvegarder les tâches dans le localStorage à chaque modification
    localStorage.setItem('ganttTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: Date.now(),
      name: newTask.name,
      start: new Date(newTask.start),
      end: new Date(newTask.end),
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ name: '', start: '', end: '' });
  };

  return (
    <div className="app-container">
      <CustomNavbar />
      <div className="main-content" style={{width:"82%"}}>
        <UserSidebar />
        <div className="gantt-content">
          <h1>Diagramme de Gantt</h1>
          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              name="name"
              value={newTask.name}
              onChange={handleInputChange}
              placeholder="Nom de la tâche"
              required
            />
            <input
              type="date"
              name="start"
              value={newTask.start}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="end"
              value={newTask.end}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Ajouter une tâche</button>
          </form>
          <div className="gantt-chart">
            <Timeline
              data={tasks}
              links={[]}
              mode="month"
              itemHeight={40}
              keys={{
                id: 'id',
                start: 'start',
                end: 'end',
                name: 'name',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gantt;