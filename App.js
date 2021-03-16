import './App.css';
import React, { Component } from 'react'
import GPlace from './Gplace';
import ReactLoading from 'react-loading';

// API key of the google map
const GOOGLE_MAP_API_KEY = 'AIzaSyDWABjiUb5VF5IT9X3Z8Q6pRQgHvsiORLM';

// load google map script
const loadGoogleMapScript = (callback) => {
  if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
}

class App extends Component {
  state = {
    loadMap: false
  }

  componentDidMount() {
    loadGoogleMapScript(() => {
      this.setState({
        loadMap: true
      })
    });
  }

  render() {
    const { loadMap } = this.state
    return (
      <div className="App">
          {!loadMap ? 
            <div className="Loading-cont">
              <ReactLoading
                type="spinningBubbles"
                color="#70c1e9"
              />
            </div>
            : <GPlace />
          }
    </div>
    )
  }
}

export default App
