"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlignCenter, Bluetooth } from "lucide-react";
import Image from 'next/image';


const WeatherWidget = () => {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Weather App</CardTitle>
        <CardDescription>Enter a location to get the weather</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex justify-center">
          <Input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            className="max-w-md"
          />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {weather && (
          
          <div style={{backgroundColor:'#0765af', width:'500px'}} className="text-white rounded-lg mx-auto mt-6">
            <div className="flex justify-between items-center px-4 py-2">
            <h2 className="text-lg">City</h2>
            <h2 className="text-2xl">{weather.location} </h2>
            </div>
            <div className="flex justify-center">
            <img src="/images/blue.png" alt="Weather icon" className="w-50 h-50"/>
            </div>
            <div className="flex justify-between items-center px-4">
            <p className="text-x1">{weather.temperature}°{weather.unit}</p>
            <p>{weather.description}</p>
</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
