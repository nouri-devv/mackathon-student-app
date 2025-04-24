import React from 'react';

const TimeTable = () => {
  const currentTime = new Date().toLocaleString();

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{new Date().toLocaleDateString()}</td>
          <td>{currentTime}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TimeTable;