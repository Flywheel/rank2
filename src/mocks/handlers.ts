import { http, HttpResponse } from 'msw';
import { contestList, slateMembers, contestViewList } from './mockdata';
export const handlers = [
  http.get('**api/ballot', req => {
    console.log('req', req);
    return HttpResponse.json([{}]);
  }),

  http.get('**api/contest', req => {
    console.log('msw handler get api/contest');
    console.log(req);
    return HttpResponse.json(contestList);
  }),
  http.post('**api/contest', async ({ request }) => {
    console.log('msw handler post api/contest');
    console.log(request);
    const nextPost = await request.json();
    return HttpResponse.json(nextPost);
  }),

  http.get('**api/contestview', req => {
    console.log('msw handler get api/contestView');
    console.log(req);
    return HttpResponse.json(contestViewList);
  }),

  http.get('**api/slate', req => {
    console.log('req', req);
    return HttpResponse.json(slateMembers);
  }),
];
