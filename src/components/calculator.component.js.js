import React from "react";

import axios from "axios";

class Calculator extends React.Component {
  constructor() {
    super();
    this.state = {
      prevValue: "",
      operations: ["+", "-", "*", "/", "."],
      currValue: "",
      result: "",
      message: "Welcome to my Calculator Application!",
      deletebuttons: ["AC", "C"],
      buttons: [
        "7",
        "8",
        "9",
        "/",
        "4",
        "5",
        "6",
        "*",
        "1",
        "2",
        "3",
        "-",
        ".",
        "0",
        "=",
        "+",
      ],
    };
  }

  Read() {
    console.log("Read the number from the file!");
    axios
      .get("http://localhost:5000/number/mynumber")
      .then((res) => {
        // console.log(res.data)
        this.setState(
          { result: res.data.value }, this.SendMessage("The number value: " + this.state.result + "\n")
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  SendMessage(message)
  {
    console.log(message);
    this.setState({message: message});
  }

  Write() {
    if(isNaN(this.state.result)){
      this.setState({message: "Your expression is not a number, please edit it!" })
      return;  //check if the result is a number or not
    }
    console.log("Write the number to the file!");
    // console.log('The number value: ' + this.state.result + "\n");

    const obj = { id: "mynumber", value: this.state.result };
    axios
      .post("http://localhost:5000/number/update/mynumber", obj)
      .then((res) => console.log(res.data.value)
      )
      .catch(function (error) {
        console.log(error);
      });
  }

  SendMessageToWrite(data)
  {
    console.log(data);
  }

  updateValues = (value) => {
    this.setState(
      { currValue: this.state.currValue },
      this.updatePrevvalue(value)
    );
  };

  updatePrevvalue = (value) => {
    this.setState({ prevValue: value });
  };

  addToExpression = (value) => {
    if (this.state.result !== "") {
      this.updateValues(value);
    }
    if (value === "AC") {
      this.setState({ result: "" });
    } else if (value === "C") {
      if (this.state.prevValue !== "=") {
        this.setState({ result: this.state.result.slice(0, -1) });
      } else {
        this.setState({ result: this.state.result });
      }
    } else if (
      value === "=" &&
      !this.state.operations.includes(this.state.prevValue)
    ) {
      let prev = "";
      let curr = "";

      for (let index = 0; index < this.state.result.length - 1; index++) {
        prev = this.state.result[index];
        curr = this.state.result[index + 1];
        if (
          this.state.operations.includes(prev) &&
          this.state.operations.includes(curr)
        ) {
          return;
        }
      }

      this.setState({ result: eval(this.state.result) });
    } else {
      this.setState({ result: this.state.result + value });
    }
  };

  listButtons() {
    let buttons = this.state.buttons;
    let deletebuttons = this.state.deletebuttons;
    return (
      <div>
        {deletebuttons.map((value, index) => {
          return (
            <button
              key={index}
              className="responsive long"
              onClick={() => this.addToExpression(value)}
            >
              {" "}
              {value}{" "}
            </button>
          );
        })}
        {buttons.map((value, index) => {
          return (
            <button
              className="responsive"
              key={index}
              onClick={() => this.addToExpression(value)}
            >
              {" "}
              {value}{" "}
            </button>
          );
        })}
        <button className="responsive long" onClick={() => this.Read()}>
          {" "}
          READ{" "}
        </button>
        <button className="responsive long" onClick={() => this.Write()}>
          {" "}
          WRITE{" "}
        </button>
      </div>
    );
  }

  render() {
    let myresult = this.state.result;
    return (
      <div>
        <div className="calculator">
          <h1>CALCULATOR</h1>
          <textarea readOnly value={this.state.message}>
            
          </textarea>
          <div>
            <input
              className="result"
              type="text"
              readOnly
              value={myresult}
            ></input>
          </div>
          {this.listButtons()}
        </div>
      </div>
    );
  }
}

export default Calculator;
