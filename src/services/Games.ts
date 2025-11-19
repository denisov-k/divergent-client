import ServiceTransport from './Transport';

const transport = new ServiceTransport();

const getList = async () =>
  await transport.request('/games/list')
    .then(res => res.data);

const getLink = (id: number) =>
  transport.request('/games/link', { id }, 'get')
    .then(res => res.data.link);

const gamesService = { getList, getLink };

export default gamesService;
