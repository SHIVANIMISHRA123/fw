import React, { useState } from 'react';

function ConfirmationPage({ formData, onFeedbackSubmit }) {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = () => {
    // Submit feedback to your backend or store it in your state
    onFeedbackSubmit(feedback);

    // Display a thank-you message
    alert('Thank you for your feedback!');
  };

  return (
    <div className="confirmation-page">
      {/* <h2>Confirmation</h2> */}
      {/* <p>Your form data has been received:</p> */}

      {/* Display the submitted form data */}
      <ul>
        {/* <li>Name: {formData.name}</li>
        <li>Contact: {formData.contact}</li> */}
        {/* Include other form fields as needed */}
      </ul>

      {/* Feedback form */}
      <h3>Feedback</h3>
      <textarea
        rows="4"
        cols="50"
        value={feedback}
        onChange={handleFeedbackChange}
        placeholder="Your feedback..."
      ></textarea>
      <br />
      <button onClick={handleSubmitFeedback}>Submit Feedback</button>
    </div>
  );
}

export default ConfirmationPage;
