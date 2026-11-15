import { createImpactLoader } from '../../server/playtest-impact.mjs';
const load = createImpactLoader();
export default async request => {
  if (request.method !== 'GET') return Response.json({error:'Method not allowed'}, {status:405, headers:{Allow:'GET'}});
  try {
    return Response.json(await load(), {headers:{'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}});
  } catch {
    return Response.json({error:'Playtest results are temporarily unavailable.'}, {status:503, headers:{'Cache-Control':'no-store'}});
  }
};
export const config = {path:'/api/playtest-impact'};
