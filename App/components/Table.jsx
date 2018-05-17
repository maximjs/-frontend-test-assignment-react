import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';

export default (props) => {
  const { tasks } = props;
  const summTime = tasks.reduce((acc, task) =>
    acc.add(moment(task.time, moment.ISO_8601).second(), 's'), moment({ minute: 0, seconds: 0 }));
  const tbody = tasks.map(({ id, answer, time }) => {
    const momentTime = moment(time, moment.ISO_8601);
    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{answer}</td>
        <td>{momentTime.format('mm:ss')}</td>
      </tr>
    );
  });

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Номер вопроса</th>
          <th>Ответ</th>
          <th>Время</th>
        </tr>
      </thead>
      <tbody>
        {tbody}
        <tr>
          <td />
          <td>Итого:</td>
          <td>{summTime.format('mm:ss')}</td>
        </tr>
      </tbody>
    </Table>
  );
};
