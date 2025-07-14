import { Button, Row, Col, Card, Container } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AddWorkout from '../components/AddWorkout';
import WorkoutDetailsModal from '../components/WorkoutDetailsModal';

export default function Workouts() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleOpenDetails = (workout) => {
    setSelectedWorkout(workout);
    setShowDetails(true);
};

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedWorkout(null);
};
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWorkouts(data);
        } else if (Array.isArray(data.workouts)) {
          setWorkouts(data.workouts);
        } else {
          setWorkouts([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setWorkouts([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <h3>Please log in to view your workouts.</h3>
      </Container>
    );
  }

  return (
    <div className="px-4 m-4">
      <h1 className="text-center mt-5 mb-4">My Workouts</h1>

      
      <div className="d-flex justify-content-center mb-5">
        <AddWorkout onWorkoutAdded={fetchData} />
      </div>

      {isLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Row className="g-4">
          {workouts.map((workout) => (
            <Col md={3} key={workout._id}>
              <Card className="h-100 shadow">
                <Card.Body>
                  <Card.Title className='mt-2 fw-bold bg-dark rounded text-white p-3'>
                    {workout.name}
                  </Card.Title>
                  <hr />
                  <Card.Text className='mx-2 mt-3'>
                    <strong>Duration:</strong> {workout.duration} mins
                  </Card.Text>
                  <Card.Text className='mx-2'>
                    <strong>Status:</strong> {workout.status}
                  </Card.Text>
                  <Card.Text className='mx-2'>
                    <strong>Date Added:</strong>{' '}
                    {workout.dateAdded
                      ? new Date(workout.dateAdded).toLocaleDateString('en-PH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not set'}
                  </Card.Text>
                </Card.Body>
                <div className="mb-4 ms-3 d-flex justify-content-start">
                  <Button variant="primary" onClick={() => handleOpenDetails(workout)}>Details</Button>
                </div>
              </Card>
              <WorkoutDetailsModal show={showDetails} handleClose={handleCloseDetails} workout={selectedWorkout} onUpdated={fetchData} />
            </Col>

          ))}
        </Row>
      )}
    </div>
  );
}
