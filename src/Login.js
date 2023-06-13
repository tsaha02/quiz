import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import firebase from "./firebase";

function Login({ setLoginComplete, setRegistrationComplete }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoginComplete(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login">
      <h2>Login Page</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <br />

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <br />

      {error && <Alert variant="danger">{error}</Alert>}

      <p>
        New user?{" "}
        <a href="#registration" onClick={() => setRegistrationComplete(false)}>
          Register
        </a>
      </p>
    </div>
  );
}

export default Login;
