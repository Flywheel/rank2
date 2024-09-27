import { http, HttpResponse } from 'msw';
import { contestList, slateMembers, contestViewList } from './mockdata';
export const handlers = [
  http.get('**api/ballot', req => {
    if (environment.ianConfig.showLogs) console.log('req', req);
    return HttpResponse.json([{}]);
  }),

  http.get('**api/contest', req => {
    if (environment.ianConfig.showLogs) console.log('msw handler get api/contest');
    if (environment.ianConfig.showLogs) console.log(req);
    return HttpResponse.json(contestList);
  }),
  http.post('**api/contest', async ({ request }) => {
    if (environment.ianConfig.showLogs) console.log('msw handler post api/contest');
    if (environment.ianConfig.showLogs) console.log(request);
    const nextPost = await request.json();
    return HttpResponse.json(nextPost);
  }),

  http.get('**api/contestview', req => {
    if (environment.ianConfig.showLogs) console.log('msw handler get api/contestView');
    if (environment.ianConfig.showLogs) console.log(req);
    return HttpResponse.json(contestViewList);
  }),

  http.get('**api/slate', req => {
    if (environment.ianConfig.showLogs) console.log('req', req);
    return HttpResponse.json(slateMembers);
  }),
];
