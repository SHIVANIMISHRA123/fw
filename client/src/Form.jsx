import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useNavigate } from 'react-router-dom';
import ConfirmationPage from './ConfirmationPage';

function Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    latitude: null,
    longitude: null,
    sharedActivities: [],
    favors: [],
    tutoringSubjects: '',
  });

  const [matchingInterests, setMatchingInterests] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFeedbackSubmit = (feedback) => {
    console.log('Feedback submitted:', feedback);
  };

  useEffect(() => {
    async function fetchMatchingInterestsAndNearbyUsers() {
      try {
        // Fetch matching interests
        const response = await axios.get('/api/matching-interest', {
          params: { interests: formData.sharedActivities },
        });

        if (response.status === 200) {
          setMatchingInterests(response.data);
        } else {
          console.error('Failed to find matching interests.');
        }

        // Fetch nearby users (replace with your actual endpoint)
        const usersResponse = await axios.get('/api/nearby-users', {
          params: {
            latitude: formData.latitude,
            longitude: formData.longitude,
          },
        });

        if (usersResponse.status === 200) {
          setNearbyUsers(usersResponse.data);
        } else {
          console.error('Failed to fetch nearby users.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchMatchingInterestsAndNearbyUsers();
  }, [formData.latitude, formData.longitude, formData.sharedActivities]);

  const handleCheckboxChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: formData[field].includes(value)
        ? formData[field].filter(item => item !== value)
        : [...formData[field], value],
    };
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Request geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Extract latitude and longitude
            const { latitude, longitude } = position.coords;

            // Include geolocation data in the form data
            const updatedData = {
              ...formData,
              latitude,
              longitude,
            };

            // Send the updated form data to the server
            axios.post('http://localhost:5000/api/interest', updatedData)
              .then(() => {
                alert('Interest form submitted successfully.');
                navigate('/'); // Redirect to the home page
              })
              .catch((error) => {
                alert('Failed to submit interest form.');
              });
          },
          (error) => {
            console.error('Error getting geolocation:', error);

            // If geolocation fails, submit the form without geolocation data
            axios.post('http://localhost:5000/api/interest', formData)
              .then(() => {
                alert('Interest form submitted successfully.');
                navigate('/'); // Redirect to the home page
                setShowConfirmation(true);
              })
              .catch((error) => {
                alert('Failed to submit interest form.');
              });
          }
        );
      } else {
        console.error('Geolocation is not available in this browser.');

        // If geolocation is not available, submit the form without geolocation data
        await axios.post('http://localhost:5000/api/interest', formData);
        alert('Interest form submitted successfully.');
        navigate('/'); // Redirect to the home page
        setShowConfirmation(true);
      }
    } catch (error) {
      alert('Failed to submit interest form.');
    }
  };
  

  return (
    <div className="App">
      <div className='page'> 
      <h1 style={{color:'yellowgreen'}}>Neighborgood Interest Form</h1>
      {/* showConfirmation ? ( */}
        {/* <ConfirmationPage
          formData={formData}
          // feedback={feedback}
          // onFeedbackSubmit={handleFeedbackSubmit}
        /> */}
      {/* ) : */}
      {/* Render the Login and Signup components */}
    {/* <Login />
    <Signup /> */}
      <form onSubmit={handleSubmit} className='form'>
        <li>
        <label>
          Name :
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </label>
        </li>
        <br />
        <li>
        <label>
          Contact :
          <input
            type="text"
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
          />
        </label>
        </li>
        <br />
        <li>
        <label> Shared Activities </label>
        <br />
        <label>
          Walking :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Walking')}
            onChange={() => handleCheckboxChange('sharedActivities', 'Walking')}
          />
        </label>
        <label>
          Running :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Running')}
            onChange={() => handleCheckboxChange('sharedActivities', 'Running')}
          />
        </label>
        <label>
          Bicycling :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Bicycling')}
            onChange={() => handleCheckboxChange('sharedActivities', 'Bicycling')}
          />
        </label>
        </li>
        {/* Add more checkboxes for other shared activities */}
        <br />
        <li>
        <label>Gardening :</label>
        <br />
        <label>
          Flowers/Landscape :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Flowers/Landscape')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Flowers/Landscape')
            }
          />
        </label>
        <label>
        Fruit/Veg :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('Fruit/Veg')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'Fruit/Veg')
          }
        />
      </label>
      <label>
        Both :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('Both')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'Both')
          }
        />
        </label>
        </li>
        {/* Add checkboxes for other gardening options */}
        <br />
        <li>
        <label>Swimming :</label>
      <br />
      <label>
        My backyard :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('My backyard')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'My backyard')
          }
        />
      </label>
      <label>
        Public pool :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('Public pool')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'Public pool')
          }
        />
      </label>
      <label>
        Health club pool :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('Health club pool')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'Health club pool')
          }
        />
        </label>
        </li>
        <br />
        <li>
        <label>Coffee/tea :</label>
      <br />
      <label>
        Coffee/Tea at my place 15-30 min :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('Coffee/tea at my place 15-30 min')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'Coffee/tea at my place 15-30 min')
          }
        />
      </label>
      <label>
        Tea/Coffee at your place 15-30 min :
        <input
          type="checkbox"
          checked={formData.sharedActivities.includes('Coffee/tea at your place 15-30 min')}
          onChange={() =>
            handleCheckboxChange('sharedActivities', 'Coffee/tea at your place 15-30 min')
          }
        />
      </label>
      </li>
      <br />
        
       
       <h2>Favors I can do : </h2> 
      <br />
      <li>
      <label>Errands :</label>
      <br />
      <label>
        Emergencies
        <input
          type="checkbox"
          checked={formData.favors.includes('Errands (Emergencies)')}
          onChange={() =>
            handleCheckboxChange('favors', 'Errands (Emergencies)')
          }
        />
      </label>
      <label>
        Occasional :
        <input
          type="checkbox"
          checked={formData.favors.includes('Errands (Occasional)')}
          onChange={() =>
            handleCheckboxChange('favors', 'Errands (Occasional)')
          }
        />
      </label>
      <label>
        Regular/frequent :
        <input
          type="checkbox"
          checked={formData.favors.includes('Errands (Regular/frequent)')}
          onChange={() =>
            handleCheckboxChange('favors', 'Errands (Regular/frequent)')
          }
        />
      </label>
      </li>
      <br />
      <li>
      <label>
        Tutoring (which subjects?) :
        <input
          type="text"
          value={formData.tutoringSubjects}
          onChange={e => setFormData({ ...formData, tutoringSubjects: e.target.value })}
        />
      </label>
      </li>
      <br />
      <li>
      <label>
        Repair advice :
        <input
          type="checkbox"
          checked={formData.favors.includes('Repair advice')}
          onChange={() =>
            handleCheckboxChange('favors', 'Repair advice')
          }
        />
      </label>
      </li>
      <br />
      <li>
      <label>
         Sports :
        <br />
        <label>
          Football :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Football')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Football')
            }
          />
        </label>
        <label>
          Basketball :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Basketball')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Basketball')
            }
          />
        </label>
        <label>
          Other :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Other')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Other')
            }
          />
        </label>
      </label>
      </li>
      <br />
      <li>
      <label>
        Movies :
        <br />
        <label>
          Action :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Action')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Action')
            }
          />
        </label>
        <label>
          Romance :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Romance')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Romance')
            }
          />
        </label>
        <label>
          Comedy :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Comedy')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Comedy')
            }
          />
        </label>
        <label>
          Science Fiction :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Science Fiction')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Science Fiction')
            }
          />
        </label>
        <label>
          Indie :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Indie')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Indie')
            }
          />
        </label>
      </label>
      </li>
      <br />
      <li>
      <label>
        Shopping :
        <br />
        <label>
          Groceries :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Groceries')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Groceries')
            }
          />
        </label>
        <label>
          Clothing :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Clothing')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Clothing')
            }
          />
        </label>
        <label>
          Books :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Books')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Books')
            }
          />
        </label>
        <label>
          Other :
          <input
            type="checkbox"
            checked={formData.sharedActivities.includes('Other')}
            onChange={() =>
              handleCheckboxChange('sharedActivities', 'Other')
            }
          />
        </label>
      </label>
      </li>
 
        <br />
 {/* Display matching interests */}
 {matchingInterests.length > 0 && (
            <div className="matching-interests">
              <h2>Matching Interests</h2>
              <ul>
                {matchingInterests.map((interest, index) => (
                  <li key={index}>
                    <p>Name: {interest.name}</p>
                    <p>Contact: {interest.contact}</p>
                    <p>Shared Activities: {interest.sharedActivities.join(', ')}</p>
                    {/* Display additional interest details as needed */}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display nearby users */}
          {nearbyUsers.length > 0 && (
            <div className="nearby-users">
              <h2>Nearby Users</h2>
              <ul>
                {nearbyUsers.map((user, index) => (
                  <li key={index}>
                    <p>Name: {user.name}</p>
                    <p>Contact: {user.contact}</p>
                    {/* Display additional user details as needed */}
                  </li>
                ))}
              </ul>
            </div>
          )}

      {/* Feedback section */}
      
      {/* <label>
            Feedback:
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
          </label> */}
          <ConfirmationPage
          formData={formData}
           feedback={feedback}
           onFeedbackSubmit={handleFeedbackSubmit}
        />
           
     <label>
     
        <button type="submit" className='submit-button'>Submit</button>
         
        </label>
         
      </form>
    
      
    </div>
    </div>
     
  );
}

export default Form;
