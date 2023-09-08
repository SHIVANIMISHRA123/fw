import React from 'react';
import { Link } from 'react-router-dom';
// import Login from './Login'; // Import the Login component
// import Signup from './Signup'; // Import the Signup component

 const Home = () => {
  const mystyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10px 20px",
    cursor: 'pointer',
    fontFamily: "Sans-Serif",
    textAlign: 'center',
    

     

  };
  return (
    <div className='container'> 
    <div style = {{ width: '100%',height:'100%', padding: '8px', textAlign: 'center'}}>
      <h1 style ={{color:'yellowgreen', textAlign: 'center'}}>Welcome to NeighborGood!</h1>
      <p style = {{color:'peachpuff'}}>Click the button below to go to the interest form.</p>
      <Link to="/Form">
        <button style = {mystyle}>Go to Form</button>
      </Link>
        {/* Render the Login and Signup components */}
        {/* <Login />

      <Signup /> */}
      <p>  "Before proceeding to the form, kindly create an account."
</p>
      <Link to="/dashboard">
        <button style={mystyle}>Go to Dashboard</button>
         </Link>
    </div>
    </div>
  );
}

export default Home;

