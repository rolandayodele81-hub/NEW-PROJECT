import { loadBootstrapData } from '../models/bootstrap.model.js';

export async function bootstrap(req, res) {
  const data = await loadBootstrapData();
  res.json({ data });
}
