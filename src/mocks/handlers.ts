import { http, HttpResponse } from 'msw';
import { contestList, slateMembers, contestViewList } from './mockdata';
export const handlers = [
  http.get('**api/ballot', req => {
    console.log('req', req);
    return HttpResponse.json([{}]);
  }),

  http.get('**api/contest', req => {
    console.log('req', req);
    return HttpResponse.json(contestList);
  }),
  http.post('**api/contest', async ({ request }) => {
    console.log('req', request);
    const nextPost = await request.json();
    return HttpResponse.json(nextPost);
  }),

  http.get('**api/contestview', req => {
    console.log('req', req);
    return HttpResponse.json(contestViewList);
  }),

  http.get('**api/slate', req => {
    console.log('req', req);
    return HttpResponse.json(slateMembers);
  }),
];
