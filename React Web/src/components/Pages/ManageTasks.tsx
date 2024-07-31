import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { fetchAllTasks, addTask, updateTask, deleteTask } from '../../features/tasks/tasksSlice';
import { fetchAllUsers, assignTaskToUser } from '../../features/User/usersSlice';
import Navbar from '../Common/Navbar';
import AdminSidebar from '../Common/AdminSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faUserCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FaPlus } from 'react-icons/fa';

const ManageTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);
  const token = useSelector((state: RootState) => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [assignTaskId, setAssignTaskId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: '',
    due_date: '',
    progress: 0,
  });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchAllTasks());
      dispatch(fetchAllUsers());
    }
  }, [dispatch, token, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newProgress = newTask.progress;

    if (name === 'status') {
      if (value === 'todo') {
        newProgress = 0;
      } else if (value === 'completed') {
        newProgress = 100;
      }
    }

    setNewTask({ ...newTask, [name]: value, progress: newProgress });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTaskId !== null) {
      await dispatch(updateTask({
        id: editTaskId,
        ...newTask,
      }));
    } else {
      await dispatch(addTask(newTask));
    }
    setShowModal(false);
    setEditTaskId(null);
    setNewTask({ title: '', description: '', status: 'todo', priority: '', due_date: '', progress: 0 });
    dispatch(fetchAllTasks()); // Actualiser le tableau après l'ajout
  };

  const handleEdit = (task: any) => {
    setEditTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      progress: task.progress
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteTask(id));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchAllTasks());
    } else {
      console.error(`Failed to delete task with id ${id}.`);
    }
  };

  const handleAssign = (task: any) => {
    setAssignTaskId(task.id);
    setShowAssignModal(true);
  };

  const handleShowDetails = (task: any) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assignTaskId !== null && selectedUserId !== null) {
      await dispatch(assignTaskToUser({ task_id: assignTaskId, user_id: selectedUserId }));
    }
    setShowAssignModal(false);
    setAssignTaskId(null);
    setSelectedUserId(null);
    dispatch(fetchAllTasks());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid mt-5 main-content">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Manage Tasks :</h2>
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
              <button className="btn btn-primary mb-3" onClick={() => { setNewTask({ title: '', description: '', status: 'todo', priority: '', due_date: '', progress: 0 }); setShowModal(true); }}><FaPlus /> Add Task</button>
              {loading ? <div className="alert alert-info">Loading...</div> : error ? <div className="alert alert-danger">{error}</div> : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered table-striped">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Progress</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map(task => (
                        <tr key={task.id}>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>
                            <span style={{width:"100px",position:"relative",left:"1%"}} className={`badge ${task.status === 'completed' ? 'bg-success' : task.status === 'in-progress' ? 'bg-warning' : 'bg-secondary'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>{task.priority}</td>
                          <td>{task.status === 'todo' ? '0%' : task.status === 'completed' ? '100%' : `${task.progress}%`}</td>
                          <td>{task.due_date}</td>
                          <td className="d-flex">
                            <button className="btn btn-warning btn-sm me-2 d-flex align-items-center justify-content-evenly" onClick={() => handleEdit(task)}><FontAwesomeIcon icon={faPenToSquare} className="me-1" />Edit</button>
                            <button className="btn btn-danger btn-sm me-2 d-flex align-items-center justify-content-evenly" onClick={() => handleDelete(task.id)}><FontAwesomeIcon icon={faTrashCan} className="me-2" />Delete</button>
                            <button className="btn btn-info btn-sm d-flex align-items-center justify-content-evenly" onClick={() => handleAssign(task)}><FontAwesomeIcon icon={faUserCheck} className="me-2" />Assign</button>
                            <button className="icon-button" onClick={() => handleShowDetails(task)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!loading && !error && Array.isArray(tasks) && tasks.length === 0 && <div className="alert alert-warning">No tasks found.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing a task */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editTaskId ? 'Edit Task' : 'Add New Task'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={newTask.title} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" value={newTask.description} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <input type="number" min={0} max={5} className="form-control" id="priority" name="priority" value={newTask.priority} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select className="form-select" id="status" name="status" value={newTask.status} onChange={handleInputChange}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="progress" className="form-label">Progress</label>
                    <input type="number" min={0} max={100} className="form-control" id="progress" name="progress" value={newTask.progress} onChange={handleInputChange} disabled={newTask.status !== 'in-progress'} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="due_date" className="form-label">Due Date</label>
                    <input type="date" className="form-control" id="due_date" name="due_date" value={newTask.due_date} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="btn btn-primary">{editTaskId ? 'Update Task' : 'Add Task'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for assigning a task */}
      {showAssignModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Task</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAssignSubmit}>
                  <div className="mb-3">
                    <label htmlFor="user" className="form-label">Select User</label>
                    <select className="form-select" id="user" onChange={(e) => setSelectedUserId(Number(e.target.value))}>
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Assign</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for showing task details */}
      {showDetailsModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Task Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Title:</strong> {selectedTask.title}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Progress:</strong> {selectedTask.status === 'todo' ? '0%' : selectedTask.status === 'completed' ? '100%' : `${selectedTask.progress}%`}</p>
                <p><strong>Due Date:</strong> {selectedTask.due_date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
