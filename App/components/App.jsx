import React from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { fetchTasks, postAnswer } from '../api';
import Timer from './Timer';
import Question from './Question';
import Table from './Table';

const isStateSaved = () => typeof localStorage.getItem('saveState') === 'string';

class App extends React.Component {
  constructor(props) {
    super(props);
    const initState = {
      tasks: [],
      renderTasks: [],
      startBtn: true,
      currentTask: {},
      currentTaskArrIndex: 0,
      lastRenderTasksArrIndex: null,
      timerId: null,
    };
    if (isStateSaved()) {
      const state = JSON.parse(localStorage.getItem('saveState'));
      this.state = { ...state };
    } else {
      this.state = { ...initState };
    }
  }

  componentDidMount() {
    if (!isStateSaved()) {
      fetchTasks()
        .then((data) => {
          const tasks = data.map((task) => {
            const momentStart = moment({ minute: 0, seconds: 0 });
            const stringTime = momentStart.toISOString();
            return { ...task, time: stringTime };
          });
          const renderTasks = [...tasks];
          const currentTask = renderTasks[0];
          const lastRenderTasksArrIndex = renderTasks.length - 1;
          this.setState({
            tasks, lastRenderTasksArrIndex, renderTasks, currentTask,
          });
        })
        .catch(error => console.error(error));
    }
  }

  setTimerId = (timerId) => {
    this.setState({ timerId });
  };

  handleBeginBtn = () => {
    this.setState({ startBtn: false });
  };

  changeTimer = () => {
    const { currentTask } = this.state;
    const momentTime = moment(currentTask.time, moment.ISO_8601);
    momentTime.add(1, 's');
    const stringTime = momentTime.toISOString();
    const newCurrentTask = { ...currentTask, time: stringTime };
    this.setState({ currentTask: newCurrentTask });
    localStorage.setItem('saveState', JSON.stringify(this.state));
  };

  handleChangeQuestionBtn = button => () => {
    const { currentTaskArrIndex, currentTask, renderTasks } = this.state;
    const updateRenderTasks = renderTasks.map(task => (task.id === currentTask.id ? currentTask : task));
    const newCurrentTaskArrIndex = button === 'prev' ? currentTaskArrIndex - 1 : currentTaskArrIndex + 1;
    const newCurrentTask = { ...renderTasks[newCurrentTaskArrIndex] };
    this.setState({ currentTask: newCurrentTask, currentTaskArrIndex: newCurrentTaskArrIndex, renderTasks: updateRenderTasks });
  };

  handleFormSubmit = (answer) => {
    postAnswer({ id: this.state.currentTask.id, answer })
      .then(() => {
        const { currentTaskArrIndex, currentTask, renderTasks, tasks, timerId } = this.state; // eslint-disable-line
        const answeredTask = { ...currentTask };
        answeredTask.answer = answer;
        const updateTasks = tasks.map(task => (task.id === currentTask.id ? answeredTask : task));
        const newRenderTasks = renderTasks.filter(task => task.id !== currentTask.id);
        if (newRenderTasks.length === 0) {
          clearInterval(timerId);
          this.setState({ tasks: updateTasks, renderTasks: newRenderTasks });
          localStorage.setItem('saveState', JSON.stringify(this.state));
          return;
        }
        const newLastRenderTasksArrIndex = newRenderTasks.length - 1;
        const newCurrentTaskArrIndex = currentTaskArrIndex <= newLastRenderTasksArrIndex ? currentTaskArrIndex : currentTaskArrIndex - 1;
        const nextCurrentTask = { ...newRenderTasks[newCurrentTaskArrIndex] };
        this.setState({
          tasks: updateTasks,
          renderTasks: newRenderTasks,
          currentTask: nextCurrentTask,
          currentTaskArrIndex: newCurrentTaskArrIndex,
          lastRenderTasksArrIndex: newLastRenderTasksArrIndex,
        });
      })
      .catch(error => console.error(error));
  };

  render() {
    const {
      currentTask, currentTaskArrIndex, lastRenderTasksArrIndex, renderTasks, tasks,
    } = this.state;
    if (this.state.startBtn) {
      return (
        <Button bsStyle="primary" className="start-button" onClick={this.handleBeginBtn}>Начать</Button>
      );
    }

    if (renderTasks.length === 0 && tasks.length !== 0) {
      return (
        <React.Fragment>
          <h3>Результаты</h3>
          <Table tasks={tasks} />
        </React.Fragment>
      );
    }

    if (renderTasks.length !== 0 && tasks.length !== 0) {
      return (
        <React.Fragment>
          <Timer
            time={currentTask.time}
            changeTimer={this.changeTimer}
            setTimerId={this.setTimerId}
          />
          <Question
            currentTask={currentTask}
            currentTaskArrIndex={currentTaskArrIndex}
            lastRenderTasksArrIndex={lastRenderTasksArrIndex}
            handleFormSubmit={this.handleFormSubmit}
            handleChangeQuestionBtn={this.handleChangeQuestionBtn}
          />
        </React.Fragment>
      );
    }
    return null;
  }
}

export default App;
