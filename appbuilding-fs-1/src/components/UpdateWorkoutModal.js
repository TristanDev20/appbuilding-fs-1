import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function UpdateWorkoutModal({ show, handleClose, workout, onUpdated }) {
  const [name, setName] = useState(workout?.name || '');
  const [duration, setDuration] = useState(workout?.duration || '');
  const [status, setStatus] = useState(workout?.status || '');

  const handleSubmit = () => {
    fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${workout._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ name, duration, status })
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire('Updated!', 'Workout updated successfully.', 'success');
        handleClose();
        onUpdated(); // refresh workouts
      })
      .catch(err => {
        console.error("Update error:", err);
        Swal.fire('Error', 'Something went wrong.', 'error');
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className='bg-success text-white'>
        <Modal.Title>Update Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Workout Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workout name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (mins)</Form.Label>
            <Form.Control
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
            />
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Control value={status} disabled />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}
