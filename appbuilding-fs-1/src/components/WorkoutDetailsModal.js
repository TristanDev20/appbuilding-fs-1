import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {useState} from 'react';
import UpdateWorkoutModal from './UpdateWorkoutModal';


export default function WorkoutDetailsModal({ show, handleClose, workout, onUpdated }) {
	const [showUpdate, setShowUpdate] = useState(false);
	const handleOpenUpdate = () => setShowUpdate(true);
	const handleCloseUpdate = () => setShowUpdate(false);

  
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the workout permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${workout._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(res => res.json())
        .then(data => {
          Swal.fire("Deleted!", "Your workout has been deleted.", "success");
          handleClose();
          onUpdated(); // Refresh list
        })
        .catch(err => console.error("Delete error:", err));
      }
    });
  };

  const handleUpdate = () => {
    Swal.fire({
      icon: 'info',
      title: 'Update feature coming soon!',
      text: 'You can build a separate form/modal for this.',
    });
  };

  const handleMarkAsDone = () => {
  fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${workout._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ status: 'done' })
  })
    .then(res => res.json())
    .then(data => {
      Swal.fire('Workout marked as complete!', '', 'success');
      handleClose();
      onUpdated(); // Refresh list
    })
    .catch(err => {
      console.error('Status update error:', err);
      Swal.fire('Error', 'Unable to update status.', 'error');
    });
};


  if (!workout) return null;

return (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton className='bg-dark text-white'>
      <Modal.Title>Workout Details</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <p><strong>Name:</strong> {workout.name}</p>
      <p><strong>Duration:</strong> {workout.duration}</p>
      <p><strong>Status:</strong> {workout.status}</p>
      <p><strong>Date Added:</strong> {new Date(workout.dateAdded).toLocaleDateString()}</p>
    </Modal.Body>


    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Close</Button>

      <Button variant="primary" onClick={handleOpenUpdate}>Update</Button>

      <Button
        variant="success"
        onClick={handleMarkAsDone}
        disabled={workout.status === 'done'}
      >
        {workout.status === 'done' ? 'Completed' : 'Mark as Done'}
      </Button>

      <Button variant="danger" onClick={handleDelete}>Delete</Button>
    </Modal.Footer>
  </Modal>
);

}
