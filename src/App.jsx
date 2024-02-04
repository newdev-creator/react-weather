import React, { useEffect, useState } from "react";
import loader from "./assets/loader.svg";
import browser from "./assets/browser.svg";
import "./App.css";

const APIKEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = `http://api.airvisual.com/v2/nearest_city?key=${APIKEY}`;

const fetchData = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        const responseData = await fetchData();

        setWeatherData({
          city: responseData.data.city,
          country: responseData.data.country,
          iconId: responseData.data.current.weather.ic,
          temperature: responseData.data.current.weather.tp,
        });
      } catch (error) {
        setErrorInfo(error.message);
      }
    };

    fetchDataAndSetState();
  }, []);

  return (
    <main>
      <div
        className={`loader-container ${!weatherData && !errorInfo && "active"}`}
      >
        <img src={loader} alt="loading icon" />
      </div>

      {weatherData && (
        <>
          <p className="city-name">{weatherData.city}</p>
          <p className="country-name">{weatherData.country}</p>
          <p className="temperature">{weatherData.temperature}°</p>
          <div className="info-icon-container">
            <img
              src={`/icons/${weatherData.iconId}.svg`}
              className="info-icon"
              alt="weather icon"
            />
          </div>
        </>
      )}

      {errorInfo && !weatherData && (
        <>
          <p className="error-information">{errorInfo}</p>
          <img src={browser} alt="error icon" />
        </>
      )}
    </main>
  );
}

export default App;
