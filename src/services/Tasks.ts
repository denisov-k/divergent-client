import ServiceTransport from './Transport';

const transport = new ServiceTransport();

const getList = async () =>
  await transport.request('/tasks/list')
    .then(res => res.data);

const complete = (taskId: number) =>
  transport.request('/tasks/complete', { task_id: taskId }, 'post')
    .then(res => res.data);

const tasksService = { getList, complete };

export default tasksService;
