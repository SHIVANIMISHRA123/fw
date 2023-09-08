import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
     <div className='App'>
      <div className='page'>
      <h1 style={{color:'tomato'}}>Dashboard</h1>
      <p style={{color:'forestgreen'}}><b> Welcome to the Dashboard!</b></p>
      <p style={{color:'yellow'}}>
         
         
          <li>
            <Link to="/login"style={{color:' yellow'}}>Login</Link>
          </li>
          <li>
            <Link to="/signup"style={{color:' yellow'}}>Signup</Link>
          </li>
        </p>
    </div>
    </div>
  );
}

export default Dashboard;
