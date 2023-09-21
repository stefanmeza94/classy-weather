import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 5 };
    // moramo manuelno da vezemo this promenljivu za trenutnu komponentu (klasu Counter) za nas event handler zato sto svi event handleri unutar jsx gube vezu sa trenutnom klasom, zbog nacina na koji js radi u pozadini, naime kada bude procenjivao ovaj jsx dole koji vracamo, on ce za svaku nasu event handler funkciju prvo da napravi kopiju, pa je to sad obicna funkcija u kojoj this pokazuje na undefined (ukoliko smo u strict modu), bez ove linije koda this unutar event henaldera (handleDecrement) bi pokazivalo na UNDEFINED
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleDecrement() {
    this.setState((prevState) => {
      return { count: prevState.count - 1 };
    });
  }

  handleIncrement() {
    this.setState((prevState) => {
      return { count: prevState.count + 1 };
    });
  }

  render() {
    const date = new Date();
    date.setDate(date.getDate() + this.state.count);
    return (
      <div>
        <button onClick={this.handleDecrement}>-</button>
        <span>
          {date.toDateString()} [{this.state.count}]
        </span>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
}

export default Counter;
