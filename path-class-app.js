import React from 'react';

export default class App extends React.Component {
 componentDidMount() {
   if (window.optimizelyHook) {
     window.optimizelyHook();
   }
 }
 componentDidUpdate() {
   if (window.optimizelyHook) {
     window.optimizelyHook();
   }
 }
 render() {
   // your code
 }
}

