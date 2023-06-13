import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import firebase from "./firebase";

function Registration({ setRegistrationComplete }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      setRegistrationComplete(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="registration">
      <h2>Registration Page</h2>
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
          Register
        </Button>
      </Form>
      <br />

      {error && <Alert variant="danger">{error}</Alert>}

      <p>
        Already registered?{" "}
        <a href="#" onClick={() => setRegistrationComplete(true)}>
          Login
        </a>
      </p>
    </div>
  );
}

export default Registration;
