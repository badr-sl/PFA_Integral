import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { fetchUserTasks } from '../../features/tasks/tasksSlice';
import { fetchAllUsers, deleteTaskAssignment } from '../../features/User/usersSlice';
import Navbar from '../Common/Navbar';
import AdminSidebar from '../Common/AdminSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import { faCircleInfo, faDownload, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const UserTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, error } = useSelector((state: RootState) => ({
    ...state.tasks,
    tasks: state.tasks.tasks || []
  }));
  const { users } = useSelector((state: RootState) => state.users);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
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
    if (document.location.pathname !== "/admin-home") {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [tasks, statusFilter]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    if (userId) {
      dispatch(fetchUserTasks(userId));
    }
  };

  const handleShowDetails = (task: any) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const applyFilters = () => {
    let tempTasks = tasks;
    if (statusFilter) {
      tempTasks = tempTasks.filter(task => task.status === statusFilter);
    }
    setFilteredTasks(tempTasks);
  };

  const handleDelete = async (id: number) => {
    const result = await dispatch(deleteTaskAssignment(id));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchUserTasks(selectedUserId!));
    } else {
      console.error(`Failed to delete task with id ${id}.`);
    }
  };

  const handleDownloadCSV = () => {
    const csvData = tasks.map(task => ({
      Title: task.title,
      Description: task.description,
      Status: task.status,
      Priority: task.priority,
      Progress: task.progress,
      Due_Date: task.due_date,
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'User Tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = () => {
    const excelData = tasks.map(task => ({
      Title: task.title,
      Description: task.description,
      Status: task.status,
      Priority: task.priority,
      Progress: task.progress,
      Due_Date: task.due_date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'User Tasks.xlsx');
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <AdminSidebar />
        <div className="container mt-5 main-content">
          <div className="card shadow-sm" style={{position: "relative",right: "-5px",width: "1356px"}}>
            <div className="card-body">
              <h2 className="card-title mb-4">User Tasks :</h2>
              <div className="dropdown mb-3 d-flex ">
                <button className="btn btn-secondary dropdown-toggle" style={{position: "relative",left: "89%",bottom: "60px"}} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button className="dropdown-item" onClick={handleDownloadCSV}>Download CSV</button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleDownloadExcel}>Download Excel</button>
                  </li>
                </ul>
              </div>
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
              {error && <div className="alert alert-danger">{error}</div>}
              {filteredTasks.length === 0 ? (
                <div>No tasks found.</div>
              ) : (
                <div className="table-responsive"style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                            <span style={{ width: "85px", position: "relative", left: "9px" }} className={`badge ${task.status === 'completed' ? 'bg-success' : task.status === 'in-progress' ? 'bg-warning' : 'bg-secondary'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>{task.priority}</td>
                          <td>{task.due_date}</td>
                          <td>{task.status === 'todo' ? '0%' : task.status === 'completed' ? '100%' : `${task.progress}%`}</td>
                          <td>
                            <div className='d-flex'>
                              <button className="btn btn-danger btn-sm me-2 d-flex align-items-center justify-content-evenly" style={{position:"relative",left:"25px"}} onClick={() => handleDelete(task.assigned_task_id)}><FontAwesomeIcon icon={faTrashCan} className="me-2" />Delete</button>
                              <button className="icon-button d-flex align-items-center" style={{position:"relative",right:"25px"}} onClick={() => handleShowDetails(task)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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

export default UserTasks;