import React, { useState } from 'react';
import axios from 'axios';

const Interview = ({ token }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleStartInterview = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/interview/start',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setQuestion(response.data.question);  // Assuming the response has a question field
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/interview/answer',
        { answer },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setFeedback(response.data.feedback);  // Assuming the response has feedback
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Mock Interview</h2>
      <button onClick={handleStartInterview}>Start Interview</button>
      {question && (
        <div>
          <p>{question}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        </div>
      )}
      {feedback && <div><h3>Feedback:</h3><p>{feedback}</p></div>}
    </div>
  );
};

export default Interview;
