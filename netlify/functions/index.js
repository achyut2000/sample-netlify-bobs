exports.handler = async (event, context) => {
    const city = event.queryStringParameters?.city || "London"; // Default city
  
    try {
      const response = await fetch(`/.netlify/functions/store?city=${city}`);
      const weatherData = await response.json();
  
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Weather App</title>
          </head>
          <body>
            <h1>Weather in ${city}</h1>
            ${weatherData ? (
              <div>
                <p>Temperature: ${weatherData.main.temp} K</p>
                <p>Description: ${weatherData.weather[0].description}</p>
              </div>
            ) : (
              <p>City not found</p>
            )}
          </body>
        </html>
      `;
  
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
        body: html,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  };
  