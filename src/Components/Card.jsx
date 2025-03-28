import { Input, Button, Tooltip, Card as AntCard, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import humidity_icon from '../Assets/humidity.png';
import wind_icon from '../Assets/wind.png';

const WeatherCard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [cityImage, setCityImage] = useState('');
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
                name: data.name.toUpperCase(),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                status: data.weather[0].description,
            });

            Swal.fire({
                icon: 'success',
                title: `Weather Found for ${data.name} 🌤️`,
                text: 'Here is the latest weather data.',
                confirmButtonColor: '#3085d6'
            });
            getCityImage(cityName);

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

    const getCityImage = async (cityName) => {
        try {
            const unsplashKey = 'ZRR-LfUSTmDT4cH2MKy3en9EsS0mo9c3qWMu1FQfHjM'; // Replace with your Unsplash Access Key
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashKey}&per_page=1`
            );
            const data = await response.json();

            if (data.results.length > 0) {
                setCityImage(data.results[0].urls.regular);
            } else {
                setCityImage('');
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            setCityImage('');
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
        <div
        style={{
            backgroundImage: cityImage ? `url(${cityImage})` : 'rgb(238,174,202)', backgroundSize:'cover', backgroundPosition:'center'
        }}
        >
        <Row justify="end" style={{ minHeight: "100vh", padding: "20px" }}>
            <Col xs={24} sm={18} md={12} lg={10} xl={8}>
                <AntCard bordered style={{ textAlign: 'center', boxShadow: "0px 4px 8px rgb(207, 112, 112)", background:'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)'}}>
                    <h3 style={{ marginBottom: 20, color:'white' }}>Search Weather</h3>
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

                    {weatherData ? (
                        <>
                            <div style={{ marginTop: 20 }}>
                                <img src={weatherData.icon} alt="weather_icon" style={{ width: 80 }} />
                                <p style={{ textTransform: "capitalize", fontWeight:'bold', color:'white'}}>{weatherData.status}</p>
                                <h2 style={{color:'white'}}>{weatherData.temp}°C</h2>
                                <h4 style={{color:'white'}}>{weatherData.name}</h4>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <Row gutter={[16, 16]} justify="center" align="middle">
                                    {/* Humidity Section */}
                                    <Col xs={24} sm={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src={humidity_icon} alt="humidity" style={{ width: 40, marginRight: 10 }} />
                                        <div style={{ textAlign: "left" }}>
                                            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "white" }}>{weatherData.humidity}%</p>
                                            <p style={{ margin: 0, fontSize: "14px", color: "white" }}>Humidity</p>
                                        </div>
                                    </Col>

                                    {/* Wind Speed Section */}
                                    <Col xs={24} sm={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img src={wind_icon} alt="wind speed" style={{ width: 40, marginRight: 10 }} />
                                        <div style={{ textAlign: "left" }}>
                                            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "white" }}>{weatherData.windSpeed} km/h</p>
                                            <p style={{ margin: 0, fontSize: "14px", color: "white" }}>Wind Speed</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </>
                    ) : (
                        <p style={{ marginTop: 20}}>Please Enter A City Name</p>
                    )}
                </AntCard>
            </Col>
        </Row>
        </div>
    );
};

export default WeatherCard;
