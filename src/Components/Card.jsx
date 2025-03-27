import { Input, Button, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import humidity_icon from '../Assets/humidity.png';
import wind_icon from '../Assets/wind.png';

const Card = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [input, setInput] = useState('');
    const [city, setCity] = useState('');

    const getWeather = async (cityName) => {
        try {
            const key = '9d2dcdf7b1b33119396a7b1eb365c7f2';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                setWeatherData(null);
                Swal.fire({
                    icon: 'error',
                    title: 'City Not Found ❌',
                    text: 'Please enter a valid city name!',
                    confirmButtonColor: '#d33'
                });
                return;
            }

            setWeatherData({
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                temp: Math.floor(data.main.temp),
                name: data.name,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                status: data.weather[0].description
            });
            console.log(weatherData);
            
            Swal.fire({
                icon: 'success',
                title: `Weather Found for ${data.name} 🌤️`,
                text: 'Here is the latest weather data.',
                confirmButtonColor: '#3085d6'
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error Fetching Data 🚨',
                text: 'Something went wrong. Please try again later!',
                confirmButtonColor: '#d33'
            });
            setWeatherData(null);
        }
    };

    useEffect(() => {
        if (city) {
            getWeather(city);
        }
    }, [city]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = () => {
        if (input.trim() !== '') {
            setCity(input);
            setInput('');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required ⚠️',
                text: 'Please enter a city name before searching!',
                confirmButtonColor: '#f39c12'
            });
        }
    };

    return (
        <div className="mainCard"> 
            <div className="card">
                <h3 style={{ fontWeight: 'bold' }}>Search Weather</h3>
                <div className="search-container">
                    <Input className="search-input" placeholder="City Name" style={{height:'50px'}} value={input} onChange={handleChange} />
                    <Tooltip title="Search">
                        <Button type='primary' style={{height:'50px'}} onClick={handleSubmit}>Search</Button>
                    </Tooltip>
                </div>

                {weatherData ? (
                    <>
                        <div className='d-flex flex-column'>
                            <div className='d-flex justify-content-center'>
                                <img src={weatherData.icon} alt="weather_icon" style={{ height: '250px', width: '250px' }} className='img-fluid' />
                            </div>
                            <p style={{ textAlign: 'center', color: 'white', fontSize: '30px' }}>{weatherData.status}</p>
                            <h3 style={{ textAlign: 'center', color: 'white', fontSize: '30px' }}>{weatherData.temp}°C</h3>
                            <h5 style={{ textAlign: 'center', color: 'white', fontSize: '30px' }}>{weatherData.name}</h5>
                        </div>
                        <div className="container-fluid">
                            <div className="row d-flex justify-content-between">
                                <div className="col d-flex align-items-center">
                                    <img src={humidity_icon} alt="humidity" className="me-2" />
                                    <div>
                                        <p className="mb-0">{weatherData.humidity}%</p>
                                        <p className="mb-0">Humidity</p>
                                    </div>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <img src={wind_icon} alt="wind speed" className="me-2" />
                                    <div>
                                        <p className="mb-0">{weatherData.windSpeed} km/h</p>
                                        <p className="mb-0">Wind Speed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p style={{ textAlign: 'center', color: 'black', fontSize: '20px', marginTop: '20px'}}>
                        Please Enter A City Name?
                    </p>
                )}
            </div>
        </div>
    );
};

export default Card;