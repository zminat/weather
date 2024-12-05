import React from 'react';
import '../styles/WeatherDetails.css';

interface WeatherDetailsProps {
    weatherData: any;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData }) => {
    const { main, weather, wind } = weatherData;

    return (
        <div className="WeatherContainer">
            <div className="WeatherCard">
                <h2>Сегодня</h2>
                <div>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                        alt={weather[0].description}
                    />
                    <div>
                        <h1>{main.temp}°C</h1>
                        <p>Ощущается как: {main.feels_like}°C</p>
                    </div>
                </div>
                <p>Влажность: {main.humidity}%</p>
                <p>Скорость ветра: {wind.speed} м/с</p>
                <p>Описание: {weather[0].description}</p>
            </div>
        </div>
    );
};

export default WeatherDetails;
