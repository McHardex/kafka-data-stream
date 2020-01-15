import React, { Component } from 'react';
// import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { checkDuplicate, updateDuplicate } from './helper';
import './App.css';

const client = new W3CWebSocket('ws://localhost:8000');

class App extends Component {
  state = {
    messages: [],
    response: {}
  }

  UNSAFE_componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.onerror = (error) => {
        console.log("Connection Error: " + error.toString());
      };
    };
  }

  componentDidMount() {
    const { messages } = this.state;
    client.onmessage = (event) => {
      const { data } = event;
      const message = JSON.parse(data);
      this.setState({ messages: messages.concat(message) });
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.state;
    if(prevState.messages.length !== messages.length) {
      client.onmessage = (event) => {
        const { data } = event;
        const message = JSON.parse(data);
        const result = checkDuplicate(messages, message);
        const update = updateDuplicate(messages, message);
        if(result.length > 0) {
          this.setState({ messages: update });
        } else {
          this.setState({ messages: messages.concat(message) });
        }
      };
    }
  }

  render() {
    const { messages } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {
            messages.map(items => (
              <ul key={items.USERID}>
                <li>{`${items.USERID} ${items.NAME} ${items.ITEM} ${items.COST}`}</li>
              </ul>
            ))
          }
        </header>
      </div>
    );
  }
}

export default App;


// async componentDidMount() {
  //   console.log('just mounted here man');
  //   const url = "http://localhost:8088/query";
  //   const data = {
  //     "ksql": "select * from INVOICE_SUM_ITEMS WHERE rowkey='book';",
  //     "streamsProperties": {
  //       "ksql.streams.auto.offset.reset": "earliest"
  //     }
  //   }
  //   axios.post(url, data, {
  //     'Accept': 'application/vnd.ksql.v1+json',
  //     'Content-Type': 'application/vnd.ksql.v1+json',
  //   })
  //     .then((res) => {
  //       console.log("RESPONSE RECEIVED: ", res.data[1].row.columns);
  //     })
  //     .catch((err) => {
  //       console.log("AXIOS ERROR: ", err);
  //     })
  // }