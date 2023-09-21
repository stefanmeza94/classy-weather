import React from "react";
import Weather from "./components/Weather";

export function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

async function getWeather(location) {}

class App extends React.Component {
  // U javascriptu sa class fields odlikom mozemo da deklarisemo propertije direktno u komponenti unutar klakse, van bilo koje metode. Ono sto mozemo da uradimo je prakticno ovo: Mozemo da primetimo da nam ovde ne treba this kljucna rec zato sto ce ovaj deo koda state={location: 'lisbon',...} da bude postavljen na instancu komponente. A posto je this instanca komponente onda nam nije potrebno this.

  // state = {
  //   location: "lisbon",
  //   isLoading: false,
  //   displayLocation: "",
  //   weather: {},
  // };

  constructor(props) {
    super(props);

    this.state = {
      location: "lisbon",
      isLoading: false,
      displayLocation: "",
      weather: {},
    };
    this.fetchWeather = this.fetchWeather.bind(this);
  }
  /* da smo ovde definisali event handler funkciju i da smo prosledili referencu dole unutar jsx koda onda bi trebali manuelno da definisemo this kljucnu rec da pokazuje kad ovoj klasi app */

  /* Ono sto je dobro kod class fields jeste sto isto kao promenljive mozemo da definisemo i metode (event handlere). Takodje sada mozemo da definisemo promenljivu na koju cemo da zakacimo vrednost funkcije, a ta funkcija sada moze da bude cak i arrow funkcija (koja ranije nije mogla da se koristi jer ne dobija this kljucnu rec u execution contextu). Sada event handler ne gubi vezu sa this kljucnom recju, tako da vise ne moramo da radimo ovo this.fetchWeather = this.featchWeather.bind(this). Sada su ove metode definisane kao obicne varijable unutar klase */

  // fetchWeather = async () => {
  //   try {
  //     this.setState({ isLoading: true });
  //     // 1) Getting location (geocoding)
  //     const geoRes = await fetch(
  //       `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
  //     );
  //     const geoData = await geoRes.json();

  //     if (!geoData.results) throw new Error("Location not found");

  //     const { latitude, longitude, timezone, name, country_code } =
  //       geoData.results.at(0);
  //     this.setState({
  //       displayLocation: `${name} ${convertToFlag(country_code)}`,
  //     });

  //     // 2) Getting actual weather
  //     const weatherRes = await fetch(
  //       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
  //     );
  //     const weatherData = await weatherRes.json();
  //     this.setState({ weather: weatherData.daily });
  //   } catch (err) {
  //     console.err(err);
  //   } finally {
  //     this.setState({ isLoading: false });
  //   }
  // }

  async fetchWeather() {
    try {
      // kao sto vidimo ovde nismo morali da spreadujemo objekat this.state, bukvalno treba samo da definisemo koji property iz this.state objekta hocemo da promenimo, i time necemo da mutiramo state! Dok sa useState hook-om u funkcionalnim komponentama ukoliko je state objekat, moramo da vratimo ceo objekat i onda da definisemo property koji zelimo da menjamo kako ne bi mutirali ceo state!
      this.setState({ isLoading: true });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.err(err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <div>
          {/* Kao sto vidimo ovde nismo morali da manualeno bindujemo this kljucnu rec za ovu event handler funkciju to moramo da radimo samo kada definisemo event handler funkciju gore u klasi a ovde je prosledimo kao referencu, bas kao sto radimo za fetchWeather*/}
          <input
            type="text"
            placeholder="Search from location..."
            value={this.state.location}
            onChange={(e) => this.setState({ location: e.target.value })}
          />
        </div>
        <button onClick={this.fetchWeather}>Get weather</button>

        {this.state.isLoading && <p className="loader">Loading...</p>}
        {this.state.weather.weathercode && (
          <Weather
            weather={this.state.weather}
            location={this.state.displayLocation}
          />
        )}
      </div>
    );
  }
}

export default App;

// nastavi od child to parent communication
