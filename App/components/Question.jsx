import React from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';

class Question extends React.Component {
  state = { inputValue: '' };

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleFormSubmit(this.state.inputValue);
    this.setState({ inputValue: '' });
  };

  render() {
    const {
      currentTask, currentTaskArrIndex, lastRenderTasksArrIndex, handleChangeQuestionBtn,
    } = this.props;
    return (
      <React.Fragment>
        <img src={currentTask.image} className="image-question" alt="question" />
        <div className="answer">
          <Button bsStyle="primary" className="button-prev" disabled={currentTaskArrIndex === 0} onClick={handleChangeQuestionBtn('prev')}>Предыдущий вопрос</Button>
          <Form className="answer-form">
            <FormControl
              type="text"
              placeholder="Введите ответ"
              onChange={this.handleChange}
              value={this.state.inputValue}
            />
            <Button bsStyle="success" className="button-submit" type="submit" onClick={this.handleSubmit}>Отправить</Button>
          </Form>
          <Button bsStyle="primary" className="button-next" disabled={currentTaskArrIndex === lastRenderTasksArrIndex} onClick={handleChangeQuestionBtn('next')}>Следующий вопрос</Button>
        </div>
      </React.Fragment>
    );
  }
}

export default Question;
