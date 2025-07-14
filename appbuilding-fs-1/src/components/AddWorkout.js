import React, { useState } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AddWorkout({ onWorkoutAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('pending');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'duration') setDuration(value);
    if (name === 'status') setStatus(value);
  };

  const handleAddWorkout = async () => {
    const dateAdded = new Date(); // <-- set the current date here

    fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name,
        duration,
        status,
        dateAdded
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Workout added:', data);
        setIsOpen(false);
        setName('');
        setDuration('');
        setStatus('pending'); // reset to default
        onWorkoutAdded();
        Swal.fire({
          title: "Added Workout Successfully!",
          icon: "success"
        });
      })
      .catch(err => console.error('Error:', err));
  };

  return (
    <>
      <Container className='p-0 m-0'>
        <Button onClick={() => setIsOpen(true)} className='rounded-0'>Add New Workout</Button>

        <Modal show={isOpen} onHide={() => setIsOpen(false)} className='mt-5'>
          <Modal.Header closeButton className='bg-dark text-white'>
            <Modal.Title>Add Workout</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Enter workout name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  name="duration"
                  value={duration}
                  onChange={handleChange}
                  placeholder="Enter duration"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddWorkout}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
