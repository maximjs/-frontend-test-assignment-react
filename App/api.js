const tasks = [
  {
    id: '1',
    image: 'https://dummyimage.com/600x400/000/00ffd5.png',
  },
  {
    id: '2',
    image: 'https://dummyimage.com/600x400/000/ff00d5.png',
  },
  {
    id: '3',
    image: 'https://dummyimage.com/600x400/000/0f0fd5.png',
  },
];

export const fetchTasks = () => Promise.resolve(tasks);

const answered = [];

export const postAnswer = ({ id, answer }) => new Promise((resolve, reject) => {
  console.log({ id, answer });
  if (answered.includes(id)) return reject(new Error('already answered'));
  if (!Array.from('123').includes(id)) return reject(new Error('wrong id'));
  answered.push(id);
  return resolve(`answer ${answer} accepted`);
});

