import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('**api/ballot', req => {
    console.log('req', req);
    return HttpResponse.json([{}]);
  }),

  http.get('**api/contest', req => {
    console.log('req', req);
    return HttpResponse.json([
      {
        id: 1,
        authorId: 1,
        contestTitle: 'US President 2024',
        contestDescription: 'Candidate for President of the United States',
        topSlateId: 1,
        opens: new Date('2024-01-01'),
        closes: new Date('2024-11-01'),
      },
      {
        id: 2,
        authorId: 1,
        contestTitle: 'Dem VP 2024',
        contestDescription: 'Candidates for Democratic VP Nominee',
        topSlateId: 2,
        opens: new Date('2024-01-01'),
        closes: new Date('2024-11-01'),
      },
    ]);
  }),
  http.post('**api/contest', async ({ request }) => {
    console.log('req', request);
    const nextPost = await request.json();
    return HttpResponse.json(nextPost);
  }),
];
