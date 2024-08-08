import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface User {
  id: number;
  name: string;
}

interface TaskAssignment {
  id: number;
  user_id: number;
  assigned_at: string;
  progress: number;
  task_id: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  progress: number | null;
}

const AdminHome: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem('token');
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Pas de token d'authentification");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const taskAssignmentsResponse = await axios.get('http://localhost:8000/api/task-assignments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskAssignments(taskAssignmentsResponse.data);

        const usersResponse = await axios.get('http://localhost:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (selectedUserId !== null) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8000/api/user/${selectedUserId}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          console.log("Full API Response:", response); 
    
          // Accessing tasks directly from response.data.data
          if (response.data.data && Array.isArray(response.data.data)) {
            setUserTasks(response.data.data); 
    
           
            const taskProgress = response.data.data.map((task: Task) => {
              console.log("Task Progress:", task.progress); 
              return task.progress; 
            });
            console.log("User Tasks Progress:", taskProgress); 
          } else {
            setError('Les données de tâches ne sont pas au format attendu');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des tâches de l\'utilisateur :', error);
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || 'Erreur lors du chargement des tâches de l\'utilisateur');
          } else {
            setError('Erreur lors du chargement des tâches de l\'utilisateur');
          }
        } finally {
          setLoading(false);
        }
      }
    };
    
    
    
    
    
  
    fetchUserTasks();
  }, [selectedUserId, token]);
  

  if (loading) return <Layout role="admin"><p>Chargement...</p></Layout>;
  if (error) return <Layout role="admin"><p>{error}</p></Layout>;
  if (taskAssignments.length === 0) return <Layout role="admin"><p>Aucune donnée disponible</p></Layout>;

  const tasksByDate = taskAssignments.reduce((acc, assignment) => {
    const date = assignment.assigned_at.split(' ')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tasksOverTimeChartData = {
    labels: Object.keys(tasksByDate),
    datasets: [{
      label: 'Tasks Assigned',
      data: Object.values(tasksByDate),
      fill: false,
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
    }],
  };

  const userTaskCounts = taskAssignments.reduce((acc, assignment) => {
    const user = users.find(u => u.id === assignment.user_id);
    const userName = user ? user.name : `Unknown (ID: ${assignment.user_id})`;
    if (!acc[assignment.user_id]) {
      acc[assignment.user_id] = { name: userName, count: 0 };
    }
    acc[assignment.user_id].count += 1;
    return acc;
  }, {} as Record<number, { name: string; count: number }>);

  const tasksPerUserChartData = {
    labels: Object.values(userTaskCounts).map(user => user.name),
    datasets: [{
      label: 'Number of Tasks',
      data: Object.values(userTaskCounts).map(user => user.count),
      backgroundColor: '#4BC0C0',
    }],
  };

  const userProgressChartData = {
    labels: userTasks.map(task => `Task ${task.id}`), // Access task.id to set labels
    datasets: [
      {
        label: 'Task Progress',
        data: userTasks.map(task => task.progress || 0), // Access task.progress, default to 0 if undefined
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  

  const userProgressChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Progress (%)',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: selectedUserId ? `Progress for User ${selectedUserId}` : 'Progress for All Users',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Layout role="admin">
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      <p className="text-center">Welcome, {user?.name || 'Admin'}!</p>

      <div className="container">
        <div className="row mb-4">
          <div className="col-md-6">
            <div style={{ height: '300px' }}>
              <h2 className="text-center">Tasks per User</h2>
              <Bar data={tasksPerUserChartData} options={commonChartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <div style={{ height: '300px' }}>
              <h2 className="text-center">Tasks Assigned Over Time</h2>
              <Line data={tasksOverTimeChartData} options={commonChartOptions} />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <div className="form-group" style={{ marginTop: "35px" }}>
              <label htmlFor="user-select">Select User: </label>
              <select
                id="user-select"
                className="form-control"
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                value={selectedUserId || ""}
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div style={{ height: '400px' }}>
              <Bar data={userProgressChartData} options={userProgressChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
