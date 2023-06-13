import React from "react";
import { Card } from "react-bootstrap";

function QuizResultHistory({ quizResults }) {
  return (
    <Card className="quiz-result-history">
      <Card.Body className="quiz-result-history-body">
        <Card.Title>Quiz Result History</Card.Title>
        {quizResults.length > 0 ? (
          <ul>
            {quizResults.map((result, index) => (
              <li key={index}>
                <strong>Date:</strong> {result.date}, <strong>Score:</strong>{" "}
                {result.score}
              </li>
            ))}
          </ul>
        ) : (
          <p>No quiz results found.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default QuizResultHistory;
