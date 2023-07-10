import React, { useEffect, useState } from "react";
import { Button, Container, Card } from "react-bootstrap";
import firebase from "./firebase";
import Registration from "./Registration";
import Login from "./Login";
import Profile from "./Profile";
import QuizResultHistory from "./QuizResultHistory";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [user, setUser] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    fetchQuestions();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoginComplete(true);
      } else {
        setUser(null);
      }
    });
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple"
      );
      const data = await response.json();
      setQuestions(data.results);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
      saveQuizResult();
    }
  };

  const saveQuizResult = () => {
    const result = {
      date: new Date().toLocaleString(),
      score: score,
    };
    saveQuizResultToDatabase(user.uid, result);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    setLoginComplete(false);
  };

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const results = await fetchQuizResultsFromDatabase(user.uid);
        setQuizResults(results);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    if (user) {
      fetchQuizResults();
    }
  }, [user]);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  const answerOptions = [
    ...currentQuestionData.incorrect_answers,
    currentQuestionData.correct_answer,
  ];

  const percentage = (score / questions.length) * 100;
  let message = "";

  if (percentage === 100) {
    message = "Perfect!";
  } else if (percentage >= 50) {
    message = "You Scored Well. But You Can Score More";
  } else {
    message = "You Can Do Better. Try Again....";
  }

  const saveQuizResultToDatabase = async (userId, result) => {
    try {
      const resultsRef = firebase.database().ref(`results/${userId}`);
      await resultsRef.push(result);
    } catch (error) {
      console.error("Error saving quiz result:", error);
    }
  };

  const fetchQuizResultsFromDatabase = async (userId) => {
    try {
      const snapshot = await firebase
        .database()
        .ref(`results/${userId}`)
        .orderByKey()
        .limitToLast(10)
        .once("value");
      const results = snapshot.val() || {};
      return Object.values(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      return [];
    }
  };

  return (
    <div className="app">
      <Container className="py-4">
        {!user && !registrationComplete && (
          <Registration setRegistrationComplete={setRegistrationComplete} />
        )}

        {!user && registrationComplete && (
          <Login
            setLoginComplete={setLoginComplete}
            setRegistrationComplete={setRegistrationComplete}
          />
        )}

        {user && loginComplete && !showProfile && (
          <div className="profile-navbar">
            <Button variant="success" onClick={() => setShowProfile(true)}>
              Profile
            </Button>
            <Button variant="danger" onClick={handleLogout} className="ml-2">
              Logout
            </Button>
          </div>
        )}

        {user && loginComplete && showProfile && (
          <Profile
            user={user}
            handleLogout={handleLogout}
            setShowProfile={setShowProfile}
            quizResults={quizResults}
          />
        )}

        {user && loginComplete && !showProfile && (
          <>
            {showScore ? (
              <>
                <Card className="score-section">
                  <Card.Body>
                    <Card.Title>
                      You scored {score} out of {questions.length} ({percentage}
                      %)
                    </Card.Title>
                    <Card.Text>{message}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={resetQuiz}
                      className="mt-4"
                    >
                      Play Again
                    </Button>
                    <br />
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      className="mt-2"
                    >
                      Logout
                    </Button>
                  </Card.Body>
                </Card>
                <QuizResultHistory quizResults={quizResults} />
              </>
            ) : (
              <>
                <Card className="question-card">
                  <Card.Body>
                    <Card.Text className="mb-4">
                      Question {currentQuestion + 1} of {questions.length}
                    </Card.Text>
                    <Card.Title>{currentQuestionData.question}</Card.Title>
                  </Card.Body>
                </Card>
                <div className="answer-section">
                  {answerOptions.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline-primary"
                      className="mb-2"
                      onClick={() =>
                        handleAnswerOptionClick(
                          answer === currentQuestionData.correct_answer
                        )
                      }
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
