import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { fetchUserTasks, updateTask } from '../../features/tasks/tasksSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Common/Navbar';
import UserSidebar from '../Common/UserSidebar';
import '../../App.css';

const Tasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const token = useSelector((state: RootState) => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user && user.id) {
      console.log("Fetching tasks for user ID:", user.id);
      dispatch(fetchUserTasks(user.id));
    }
  }, [dispatch, token, user, navigate]);

  useEffect(() => {
    applyFilters();
  }, [tasks, statusFilter, searchQuery]);

  const handleShowDetails = (task: any) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, status: e.target.value });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, progress: parseInt(e.target.value) });
    }
  };

  const handleSaveChanges = async () => {
    if (selectedTask) {
        
        let updatedTask = { ...selectedTask };
        if (selectedTask.status === 'todo') {
            updatedTask.progress = 0;
        } else if (selectedTask.status === 'completed') {
            updatedTask.progress = 100;
        }

        await dispatch(updateTask(updatedTask));
        handleCloseModal();
        dispatch(fetchUserTasks(user.id)); 
    }
};


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const applyFilters = () => {
    setFilteredTasks([]); // Clear the table
    setTimeout(() => { // Ensure the table is cleared before applying the filter
      let tempTasks = tasks;
      if (searchQuery) {
        tempTasks = tempTasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (statusFilter) {
        tempTasks = tempTasks.filter(task => task.status === statusFilter);
      }
      setFilteredTasks(tempTasks);
    }, 100);
  };

  return (
    <div>
      <Navbar />
      <div className='d-flex'>
        <UserSidebar />
        <div className="container mt-5 main-content">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">User Tasks</h2>
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {loading ? <div className="alert alert-info">Loading...</div> : error ? <div className="alert alert-danger">{error}</div> : (
                <>
                  {filteredTasks.length === 0 ? (
                    <div>No tasks found . </div>
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
                          {filteredTasks.map((task) => (
                            <tr key={task.id}>
                              <td>{task.title}</td>
                              <td>{task.description}</td>
                              <td>
                                <span style={{ position:"relative",left:"15px", width:"100px"}} className={`badge ${task.status === 'completed' ? 'bg-success' : task.status === 'in-progress' ? 'bg-warning' : 'bg-secondary'}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td>{task.priority}</td>
                              <td>{task.due_date}</td>
                              <td>
                              {task.status === 'in-progress' ? `${task.progress}%` : task.status === 'completed' ? '100%' : '0%'}
                              </td>
                              <td>
                                <button className="btn btn-info btn-sm" onClick={() => handleShowDetails(task)}>Info</button>
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

      {showModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Task Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Title:</strong> {selectedTask.title}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Due Date:</strong> {selectedTask.due_date}</p>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select className="form-select" id="status" value={selectedTask.status} onChange={handleStatusChange}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                {selectedTask.status === 'in-progress' && (
                  <div className="mb-3">
                    <label htmlFor="progress" className="form-label">Progress</label>
                    <input type="range" min={0} max={100} className="form-range" id="progress" value={selectedTask.progress || 0} onChange={handleProgressChange} />
                    <span>{selectedTask.progress}%</span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
