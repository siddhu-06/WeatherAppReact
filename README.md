# 🌦️ React Weather App

A clean and minimal weather application built using **pure React**, powered by the **🌐 OpenWeatherMap API** and **GeoNames City Dataset**. This project allows users to check current weather information for any city in real-time with a responsive and user-friendly interface.

---

## ✨ Features

### 🔍 City Explorer Table
- 🌍 Displays cities in an **infinite scroll table** with columns:
  - **City Name**, **Country**, **Timezone**, etc.
- 🔎 **Search as you type** with autocomplete suggestions
- 🧩 **Filter & Sort** for each column
- 🖱️ Clicking on a **city name** takes you to the weather page for that city
- 🖱️ Right-click + open in a **new tab** also works correctly

### ☁️ Weather Page
- 📍 Accessed by clicking a city name
- 🌤️ Uses [OpenWeatherMap](https://openweathermap.org/) free API to display:
  - Current temperature, min/max temperature
  - Weather description (e.g., sunny, rainy)
  - Humidity 💧
  - Wind speed 🌬️
  - Atmospheric pressure
  - Daily forecast (highs/lows, rain chances, etc.)
- 🗺️ Optional: Show location on a map
- 🌡️ Toggle between **Celsius/Fahrenheit**, **Metric/Imperial**
- ⭐ Save favorite locations
- 🕘 View recently visited weather pages
- 📍 Auto-detect user's current location and show its weather

---

## 🛠️ Tech Stack

- ⚛️ **React** (Vite + Hooks)
- 🌐 **OpenWeatherMap API**
- 🏙️ **GeoNames City Dataset**  
  [Link to API](https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/?disjunctive.cou_name_en&sort=name)
- 💅 **CSS** / Tailwind CSS (optional)
- 🧠 **TypeScript** for type safety
- 🗃️ Optional: **Next.js**, **MobX State Tree (MST)**

---

## 🚀 Getting Started

Follow the steps below to run the project locally:

```bash
# 1. 📁 Clone the repository
git clone https://github.com/siddhu_reddy06/Weather-App.git
cd Weather-App

# 2. 📦 Install dependencies
npm install

# 3. 🔑 Add your OpenWeatherMap API key
# Create a .env file in the root directory and add:
VITE_WEATHER_API_KEY=your_api_key_here
# 👉 Get your free API key here: https://openweathermap.org/api

# 4. ▶️ Start the development server
npm run dev

# 5. 🌐 Open your browser and go to:
http://localhost:5173
## 🖼️ Screenshots
  Sooonn....!!!

## 🌍 Live Demo
  Coming soon...

## 🤝 Contributing
Contributions are welcome! If you’d like to improve the app, fix a bug, or suggest a feature:
Fork the repo
Make your changes
Submit a pull request 🙌

## 📝 License
This project is licensed under the MIT License.

## Made with ❤️ using React
