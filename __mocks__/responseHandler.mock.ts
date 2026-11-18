export const mockResponseHandler = {
  ok: (data: unknown) => ( data ),
  JustOk: () => ({ status: 200 }),
  created: (data: unknown) => ( data ),
  unauthorize: () => ({ status: 401, message: 'Unauthorized' }),
  notFound: () => ({ status: 404, message: 'Resource Not Found' }),
  error: () => ({ status: 500, message: 'Oops! Something wrong!' }),
}
