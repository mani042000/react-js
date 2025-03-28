import { Input, Button, Tooltip, Row, Col } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import humidity_icon from '../Assets/humidity.png';
import wind_icon from '../Assets/wind.png';

const WeatherCard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [cityImages, setCityImages] = useState([]);
    const [input, setInput] = useState('');
    const [city, setCity] = useState('');
    const [time, setTime] = useState('');
    const timeIntervalRef = useRef(null);

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

            const weatherInfo = {
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                temp: Math.floor(data.main.temp),
                name: data.name.toUpperCase(),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                status: data.weather[0].description,
                lat: data.coord.lat,
                lon: data.coord.lon
            };

            setWeatherData(weatherInfo);
            getTime(weatherInfo.lat, weatherInfo.lon);
            getCityImages(cityName);
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

    const getTime = async (latitude, longitude) => {
        try {
            const apiKey = 'GCLYMOG371FG';
            const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK") {
                updateTime(data.formatted);
            }
        } catch (error) {
            console.error("Error fetching time:", error);
        }
    };

    const updateTime = (initialTime) => {
        if (timeIntervalRef.current) {
            clearInterval(timeIntervalRef.current);
        }

        let currentTime = new Date(initialTime);

        timeIntervalRef.current = setInterval(() => {
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            setTime(currentTime.toLocaleTimeString());
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (timeIntervalRef.current) {
                clearInterval(timeIntervalRef.current);
            }
        };
    }, []);

    const getCityImages = async (cityName) => {
        try {
            const unsplashKey = 'ZRR-LfUSTmDT4cH2MKy3en9EsS0mo9c3qWMu1FQfHjM';
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashKey}&per_page=5`
            );
            const data = await response.json();

            setCityImages(data.results.length > 0 ? data.results.map(img => img.urls.regular) : []);
        } catch (error) {
            console.error('Error fetching images:', error);
            setCityImages([]);
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

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    };

    return (
        <div className="weather-container">
            {cityImages.length > 0 && (
                <Slider {...sliderSettings} className="background-slider">
                    {cityImages.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt="city background" className="background-image" />
                        </div>
                    ))}
                </Slider>
            )}

            <div className="cards-container">
                {weatherData && (
                    <div className="weather-card">
                        <img src={weatherData.icon} alt="weather_icon" className="weather-icon" />
                        <p>{weatherData.status}</p>
                        <h2>{weatherData.temp}°C</h2>
                        <h4>{weatherData.name}</h4>
                        <h4>🕒 {time}</h4>

                        <Row gutter={[16, 16]} justify="center" style={{ marginTop: '10px' }}>
                            <Col span={12} style={{ textAlign: 'center' }}>
                                <img src={humidity_icon} alt="humidity" className="info-icon" />
                                <p>{weatherData.humidity}% Humidity</p>
                            </Col>
                            <Col span={12} style={{ textAlign: 'center' }}>
                                <img src={wind_icon} alt="wind" className="info-icon" />
                                <p>{weatherData.windSpeed} km/h Wind</p>
                            </Col>
                        </Row>
                    </div>
                )}

                <div className="search-card">
                    <h3>Search Weather</h3>
                    <Input.Group compact>
                        <Input
                            placeholder="City Name"
                            value={input}
                            onChange={handleChange}
                            style={{ width: "75%" }}
                        />
                        <Tooltip title="Search">
                            <Button type="primary" onClick={handleSubmit}>Search</Button>
                        </Tooltip>
                    </Input.Group>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;