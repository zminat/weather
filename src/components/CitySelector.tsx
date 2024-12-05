import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const API_KEY = '';
const BASE_URL = 'https://geocode-maps.yandex.ru/1.x/';

interface CitySelectorProps {
    onCityChange: (city: { name: string; lat: number; lon: number }) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onCityChange }) => {
    const [coordinates, setCoordinates] = useState<[number, number]>([55.442400, 37.363600]); // Начальные координаты Москвы
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserLocation = () => {
            if (!navigator.geolocation) {
                console.error('Геолокация не поддерживается вашим браузером');
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoordinates([latitude, longitude]);
                    onCityChange({ name: 'Ваше местоположение', lat: latitude, lon: longitude });
                    setLoading(false);
                },
                () => {
                    console.error('Ошибка доступа к геолокации');
                    setLoading(false);
                }
            );
        };

        getUserLocation();
    }, [onCityChange]);

    const handleMapClick = async (event: any) => {
        const coords = event.get('coords'); // Получаем координаты клика
        setCoordinates(coords);

        // Определяем название города
        const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&format=json&geocode=${coords[1]},${coords[0]}`
        );
        const data = await response.json();

        // Извлекаем название города
        const cityName =
            data.response.GeoObjectCollection.featureMember[0].GeoObject.description ||
            'Неизвестный город';

        onCityChange({
            name: cityName,
            lat: coords[0],
            lon: coords[1],
        });

        if (loading) {
            return <p>Загрузка текущего местоположения...</p>;
        }
    };

    return (
        <div style={{ marginTop: '20px', height: '400px' }}>
            <YMaps>
                <Map
                    defaultState={{
                        center: coordinates, // Текущее местоположение
                        zoom: 5,
                    }}
                    width="100%"
                    height="100%"
                    onClick={handleMapClick}
                >
                    <Placemark geometry={coordinates} />
                </Map>
            </YMaps>
        </div>
    );
};

export default CitySelector;
