import React from 'react';
import ReactDOM from 'react-dom';

import Img from './assets/image.jpg';
import Svg from './assets/vi_get.svg';

import './style.scss';

const App = () => {
  return (
    <div>
      <p id='test'>Hello world!</p>

      <img src='assets/image.jpg' />
      <img src={Img} />

      <Svg />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
