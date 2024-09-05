import { http, HttpResponse } from 'msw';
import { contestList, slateMembers, contestViewList } from './mockdata';
export const handlers = [
  http.get('**api/ballot', req => {
    if (this.logger.enabled) console.log('req', req);
    return HttpResponse.json([{}]);
  }),

  http.get('**api/contest', req => {
    if (this.logger.enabled) console.log('msw handler get api/contest');
    if (this.logger.enabled) console.log(req);
    return HttpResponse.json(contestList);
  }),
  http.post('**api/contest', async ({ request }) => {
    if (this.logger.enabled) console.log('msw handler post api/contest');
    if (this.logger.enabled) console.log(request);
    const nextPost = await request.json();
    return HttpResponse.json(nextPost);
  }),

  http.get('**api/contestview', req => {
    if (this.logger.enabled) console.log('msw handler get api/contestView');
    if (this.logger.enabled) console.log(req);
    return HttpResponse.json(contestViewList);
  }),

  http.get('**api/slate', req => {
    if (this.logger.enabled) console.log('req', req);
    return HttpResponse.json(slateMembers);
  }),
];
