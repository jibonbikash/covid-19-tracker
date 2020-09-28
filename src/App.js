import React, {useEffect, useState} from 'react';
import {FormControl, Select, MenuItem, Card, CardContent} from "@material-ui/core";

import 'leaflet/dist/leaflet.css';
import './App.css';

import InfoBox from "./InfoBax";
import Map from './Map';
import Table from "./Table";
import LineGraph from './LineGraph';

const App = () => {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('WW');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
    const [mapZoom, setMapZoom] = useState(2);
    const [mapCountries, setMapCountries] = useState([]);

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ));

                    const sortedData = [...data];

                    setTableData(sortedData.sort((a, b) => (a.cases > b.cases) ? -1 : 1));
                    setCountries(countries);
                    setMapCountries(data);
                });
        }
        getCountriesData();
    }, []);

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url = countryCode === 'WW' ? 'https://disease.sh/v3/covid-19/all'
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
                // console.log(data.countryInfo);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    }

    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>Covid 19 Tracker</h1>
                    <FormControl className="app__dropdown">
                        <Select
                            variant="outlined"
                            value={country}
                            onChange={onCountryChange}
                        >
                            <MenuItem value="WW">{"Worldwide"}</MenuItem>
                            {countries.map(country => <MenuItem value={country.value}>{country.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div className="app__stats">
                    <InfoBox title={"Corona Virus Cases"}
                             cases={countryInfo.todayCases}
                             total={countryInfo.cases}/>
                    <InfoBox title={"Recovered"}
                             cases={countryInfo.todayRecovered}
                             total={countryInfo.recovered}/>
                    <InfoBox title={"Deaths"}
                             cases={countryInfo.todayDeaths}
                             total={countryInfo.deaths}/>
                </div>
                <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
            </div>
            <div className={"app__right"}>
                <Card>
                    <CardContent>
                        <h3>Live cases by country</h3>
                        <Table countries={ tableData } />
                        <h3>Worldwide new cases</h3>
                        <LineGraph/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;