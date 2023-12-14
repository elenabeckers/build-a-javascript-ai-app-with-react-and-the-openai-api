import propTypes from "prop-types";

const PromptToLocation = (prompt) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const data = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    functions: [
      {
        name: "locationData",
        description: "Get the current weather in a given location.",
        parameters: {
          type: "object",
          properties: {
            country: {
              type: "string",
              description: "Country full name.",
            },
            countryCode: {
              type: "string",
              description: "Country code. Use ISO-3166.",
            },
            USState: {
              type: "string",
              description: "Full state name.",
            },
            state: {
              type: "string",
              description: "Two-letter state code.",
            },
            city: {
              type: "string",
              description: "City name.",
            },
            unit: {
              type: "string",
              description: "Location unit: metric or imperial.",
            },
          },
          required: [
            "country",
            "countryCode",
            "USState",
            "state",
            "city",
            "unit",
          ],
        },
      },
    ],
    function_call: "auto",
  };

  const params = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI}`,
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(data),
    method: "POST",
  };

  return fetch(url, params)
    .then((response) => response.json())
    .then((data) => {
      const promptRes = JSON.parse(
        data.choices[0].message.function_call.arguments
      );

      const locationString = () => {
        if (promptRes.countryCode === "US") {
          return `${promptRes.city},${promptRes.state},${promptRes.countryCode}`;
        } else {
          return `${promptRes.city},${promptRes.countryCode}`;
        }
      };

      return {
        locationString: locationString(),
        units: promptRes.unit,
        country: promptRes.country,
        USState: promptRes.USState,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      Promise.reject(
        "Unable identify a location from your question. Please try again."
      );
    });
};

PromptToLocation.propTypes = {
  prompt: propTypes.string.isRequired,
};

export default PromptToLocation;
