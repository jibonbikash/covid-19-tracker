import React from 'react';
import numeral from 'numeral';
import {Circle, Popup} from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: '#cc1034',
        multiplier: 800,
    },
};

export const showDataOnMap = (data) => {
    return data.map((country) => {
        return (
            <Circle
                center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
                color={casesTypeColors.cases.hex}
                fillColor={casesTypeColors.cases.hex}
                radius={
                    Math.sqrt(country.cases) * casesTypeColors.cases.multiplier
                }
            >
                <Popup>
                    <div>
                        <div style={{backgroundImage: `url('${country.countryInfo.flag}')`}}/>
                        <div>{ country.country }</div>
                        <div>Cases: { numeral(country.cases).format("0,0") }</div>
                        <div>Recovered: { numeral(country.recovered).format("0,0") }</div>
                        <div>Deaths: { numeral(country.deaths).format("0,0") }</div>
                    </div>
                </Popup>
            </Circle>
        );
    });
}