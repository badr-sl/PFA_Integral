import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchUserTasks } from '../../features/tasks/tasksSlice';
import { fetchAllUsers, deleteTaskAssignment } from '../../features/User/usersSlice';
import Navbar from '../Common/Navbar';
import AdminSidebar from '../Common/AdminSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchUserTasks(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  useEffect(() => {
    applyFilters();
  }, [tasks, statusFilter]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    if (userId) {
      dispatch(fetchUserTasks(userId));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const applyFilters = () => {
    setFilteredTasks([]); // Clear the table
    setTimeout(() => { // Ensure the table is cleared before applying the filter
      let tempTasks = tasks;
      if (statusFilter) {
        tempTasks = tempTasks.filter(task => task.status === statusFilter);
      }
      setFilteredTasks(tempTasks);
    }, 100);
  };

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteTaskAssignment(id));
    if (result.meta.requestStatus === 'fulfilled') {
      // Update the list of tasks after deletion
      dispatch(fetchUserTasks(selectedUserId!));
    } else {
      console.error(`Failed to delete task with id ${id}.`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-5 main-content">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">User Tasks :</h2>
              <div className="mb-4">
                <label htmlFor="userSelect" className="form-label">Select User:</label>
                <select id="userSelect" className="form-select" onChange={handleUserChange} value={selectedUserId || ''}>
                  <option value="">-- Select a User --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="statusSelect" className="form-label">Filter by Status:</label>
                <select id="statusSelect" className="form-select" onChange={handleStatusChange} value={statusFilter}>
                  <option value="">-- All Statuses --</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {loading ? <div className="alert alert-info">Loading...</div> : error ? <div className="alert alert-danger">{error}</div> : (
                <>
                  {filteredTasks.length === 0 ? (
                    <div>No tasks found.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered table-striped">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Priority</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Progress</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks.map(task => (
                            <tr key={task.id}>
                              <td>{task.title}</td>
                              <td>{task.description}</td>
                              <td>
                                <span style={{ width: "85px", position: "relative", left: "24px" }} className={`badge ${task.status === 'completed' ? 'bg-success' : task.status === 'in-progress' ? 'bg-warning' : 'bg-secondary'}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td>{task.priority}</td>
                              <td>{task.due_date}</td>
                              <td>{task.status === 'todo' ? '0%' : task.status === 'completed' ? '100%' : `${task.progress}%`}</td>
                              <td>
                              <button className="btn btn-danger btn-sm me-2 d-flex align-items-center justify-content-evenly" onClick={() => handleDelete(task.assigned_task_id)}><FontAwesomeIcon icon={faTrashCan} className="me-2" />Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTasks;
