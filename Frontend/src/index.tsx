// // src/index.tsx

// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import ReactDOM from 'react-dom';
// // import App from './loginApp';
// import './index.css';

// import APP from  './forgotApp'

// // import App from './registrationApp';

// ReactDOM.render(
//   <React.StrictMode>
//     <APP />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// src/index.tsx

import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Ensure this import statement is correct
// In index.tsx or App.tsx
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
