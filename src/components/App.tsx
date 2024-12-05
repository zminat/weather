import React, { useState, useEffect } from 'react';
import '../styles/App.css'
import '../styles/WeatherDetails.css'
import CitySelector from './CitySelector';
import WeatherDetails from './WeatherDetails';

const API_KEY = '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

interface City {
    name: string;
    lat: number;
    lon: number;
}

function App() {
    const [city, setCity] = useState<City | null>(null);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [forecastData, setForecastData] = useState<any>(null);
    const [viewType, setViewType] = useState<'current' | 'forecast'>('current');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!city) return;

            try {
                if (viewType === 'current') {
                    const response = await fetch(
                        `${BASE_URL}weather?lat=${city.lat}&lon=${city.lon}&units=metric&lang=ru&appid=${API_KEY}`
                    );
                    const data = await response.json();
                    setWeatherData(data);
                } else if (viewType === 'forecast') {
                    const response = await fetch(
                        `${BASE_URL}forecast?lat=${city.lat}&lon=${city.lon}&units=metric&lang=ru&appid=${API_KEY}`
                    );
                    const data = await response.json();
                    setForecastData(data);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных погоды:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city, viewType]);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('Геолокация не поддерживается вашим браузером');
            setCity({
                name: 'Москва',
                lat: 55.751384,
                lon: 37.619703,
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCity({
                    name: 'Ваше местоположение',
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            () => {
                console.error('Ошибка доступа к геолокации');
                setCity({
                    name: 'Москва',
                    lat: 55.751384,
                    lon: 37.619703,
                });
            }
        );
    }, []);

    if (loading) {
        return <div className={'Loading'}>Загрузка...</div>;
    }

    return (
        <div className={'AppContainer'}>
            <h1>Прогноз погоды</h1>
            {city && <h2>{city.name}</h2>}
            <CitySelector onCityChange={setCity} />

            <div>
                <button
                    className={`${'Button'} ${
                        viewType === 'current' ? 'ButtonActive' : 'ButtonInactive'
                    }`}
                    onClick={() => setViewType('current')}
                >
                    Текущая погода
                </button>
                <button
                    className={`${'Button'} ${
                        viewType === 'forecast' ? 'ButtonActive' : 'ButtonInactive'
                    }`}
                    onClick={() => setViewType('forecast')}
                >
                    Прогноз на 5 дней
                </button>
            </div>

            {viewType === 'current' && weatherData && <WeatherDetails weatherData={weatherData} />}
            {viewType === 'forecast' && forecastData && (
                <div className="WeatherContainer">
                    {Object.entries(
                        forecastData.list.reduce((acc: any, item: any) => {
                            const date = new Date(item.dt * 1000).toLocaleDateString('ru-RU');
                            if (!acc[date]) {
                                acc[date] = {
                                    minTemp: item.main.temp,
                                    maxTemp: item.main.temp,
                                    icon: item.weather[0].icon,
                                };
                            } else {
                                acc[date].minTemp = Math.min(acc[date].minTemp, item.main.temp);
                                acc[date].maxTemp = Math.max(acc[date].maxTemp, item.main.temp);
                            }
                            return acc;
                        }, {})
                    )
                        .slice(0, 5)
                        .map(([date, data]: [string, any], index: number) => (
                            <div key={index} className={'WeatherCard'}>
                                <p className={'WeatherDate'}>{date}</p>
                                <img
                                    src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                                    alt="Иконка погоды"
                                />
                                <p>Мин.: {data.minTemp.toFixed(1)}°C</p>
                                <p>Макс.: {data.maxTemp.toFixed(1)}°C</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default App;
