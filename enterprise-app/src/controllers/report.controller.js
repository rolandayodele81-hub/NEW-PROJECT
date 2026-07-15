import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import Client from '../models/client.model.js';
import Department from '../models/department.model.js';

export const queryReports = async (req, res) => {
  try {
    const { status, priority, department, projectManager, consultant, client, fromDate, toDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.department_id = department;
    if (client) filter.client_id = client;
    if (projectManager) filter.project_manager_id = projectManager;

    const projects = await Project.findAll({ where: filter, order: [['updatedAt','DESC']] });
    return res.json({ projects });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to generate report.', error: err.message });
  }
};
