import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

function Profile({ user, handleLogout, setShowProfile }) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await user.updateProfile({ displayName });
      await user.updateEmail(email);
      setError("");
      setShowProfile(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBackProfile = () => {
    setShowProfile(false);
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <Form onSubmit={handleUpdateProfile}>
        <Form.Group controlId="formDisplayName">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </Form.Group>
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
        <br />
        <Button variant="primary" type="submit">
          Update Profile
        </Button>
        {"    "}
        {"  "}
        <Button variant="danger" onClick={handleLogout} className="ml-2">
          Logout
        </Button>
        {"    "}
        {"  "}
        <Button
          variant="secondary"
          onClick={handleBackProfile}
          className="ml-2"
        >
          Back
        </Button>
      </Form>
      <br />

      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
}

export default Profile;
