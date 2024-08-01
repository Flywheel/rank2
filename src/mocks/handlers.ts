import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://localhost:6420/user', () => {
    return HttpResponse.json({
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),
  http.get('https://localhost:6420/api/contest', () => {
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
];
