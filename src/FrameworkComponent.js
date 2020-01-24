import ReactDOM from 'react-dom';
import React from 'react';

class FrameworkComponent extends HTMLElement {
  constructor() {
    super();
  };

  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    mountPoint.innerText = 'Trainings app!'

    // const test = React.createElement('p', null, 'Hello!');
    // ReactDOM.render(test, mountPoint);
  }
};

export default window.customElements.define('framework-component', FrameworkComponent);