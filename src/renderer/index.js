import React from 'react';
import ReactDOM from 'react-dom';

import Img from './assets/image.jpg';

const App = () => {
  return (
    <div>
      <p>Hello world!</p>

      <img src='assets/image.jpg' />
      <img src={Img} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
