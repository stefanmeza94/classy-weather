import React from "react";

import Day from "./Day";

class Weather extends React.Component {
  // razlog zbog kog nemamo constructor ovde (ni u day komponenti) jeste taj sto ako ne trebamo da inicijaliziramo neki state ili ne moramo manualeno da povezujemo this kljucnu rec sa nekim event handelerom onda nam i ne treba constructor!
  render() {
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;

    return (
      <div>
        <h2>Weather {this.props.location}</h2>
        <ul className="weather">
          {dates?.map((date, i) => (
            <Day
              date={date}
              key={date}
              max={max.at(i)}
              min={min.at(i)}
              code={codes.at(i)}
              isToday={i === 0}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default Weather;
