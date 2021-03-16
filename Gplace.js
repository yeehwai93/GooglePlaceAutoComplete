/* global google */
import React, { Component } from 'react'
import { connect } from "react-redux";
import * as UserActions from './actions/user'
import TextField from '@material-ui/core/TextField';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { compose, withProps, lifecycle } from "recompose";

const GOOGLE_MAP_API_KEY = 'AIzaSyDWABjiUb5VF5IT9X3Z8Q6pRQgHvsiORLM';

const MyMapComponent = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`,
        loadingElement: <div style={{ height: `100%`, width: `100%` }} />,
        containerElement: <div style={{ height: `100%`, width: `100%` }} />,
        mapElement: <div style={{ height: `100%`, width: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidMount() {
            this.renderRoute();
        },
        renderRoute() {
        }
    })
)(props =>
    <GoogleMap zoom={15} center={props.center} onClick={(e) => props.onClick(e)} onDragEnd={props.onMapDrag} />
);

class Place extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tempArray: [], 
            placeInputRef: null,
            center: {
                lat: 3.22,
                lng: 101.89
            },
        }
    }

    componentDidMount() {
        this.initPlaceAPI();
    }

    // initialize the google place autocomplete
    initPlaceAPI = () => {
        const { placeInputRef } = this.state
        let autocomplete = new window.google.maps.places.Autocomplete(placeInputRef);
        new window.google.maps.event.addListener(autocomplete, "place_changed", function () {
            let place = autocomplete.getPlace();
            this.setState ({
                address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
        });
    };

    handleInput(target) {
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        }, () => {
            if (value && value.length > 4) {
                this.state.tempArray.push(value)
                this.props.updateSearch(this.state.tempArray)
            }
        })
    }

    render() {
        const { center } = this.state
        return (
            <div className="placePage">
                <div className="textCont">
                    <TextField
                        id="place"
                        label="Place"
                        autoComplete="place"
                    />
                </div>
                <div className="mapCont">
                    <MyMapComponent
                        onMapDrag={this.handleMapDrag}
                        center={center}
                    />
                </div>
            </div>
        )
    }
}
const mapStateToProps = ({ }) => ({

});

const mapDispatchToProps = (dispatch) => ({
    updateSearch: (data) => dispatch(UserActions.updateSearchPlace(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Place);
