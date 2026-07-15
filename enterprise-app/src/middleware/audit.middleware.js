import AuditLog from '../models/auditLog.model.js';

export const logAudit = async (req, res, next) => {
  try {
    await AuditLog.create({
      user_id: req.user?.id || null,
      action: `${req.method} ${req.originalUrl}`,
      entity: req.baseUrl || null,
      entity_id: req.params.id ? String(req.params.id) : null,
      details: JSON.stringify({ body: req.body, query: req.query }),
      ip_address: req.ip,
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
  next();
};
