import React, {Component} from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './css/MessageStyle.css';
import NameComponent from "./components/NameComponent";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            typedMessage: "",
            author: ""
        }
    }

    setName = (author) => {
        console.log(author);
        this.setState({author});
    };

    sendMessage = () => {
        this.clientRef.sendMessage('/app/sendMessage', JSON.stringify({
            author: this.state.author,
            text: this.state.typedMessage,
            createdAt: new Date(),
        }));
    };

    displayMessages = () => {
        return (
            <div>
                {this.state.messages.map(msg => {
                    return (
                        <div>
                            {this.state.author === msg.author ?
                                <div>
                                    <p className="title1">{msg.author} : </p><br/>
                                    <p>{msg.text}</p>
                                </div> :
                                <div>
                                    <p className="title2">{msg.author} : </p><br/>
                                    <p>{msg.text}</p>
                                </div>
                            }
                        </div>)
                })}
            </div>
        );
    };

    render() {
        return (
            <div>
                <NameComponent setName={this.setName}/>
                <div className="align-center">
                    <h1>Sber chat</h1>
                    <br/><br/>
                </div>
                <div className="align-center">
                    User: <p className="title1"> {this.state.author}</p>
                </div>
                <div className="align-center">
                    <br/><br/>
                    <table>
                        <tr>
                            <td>
                                <TextField id="outlined-basic" label="Enter Message to Send" variant="outlined"
                                           onChange={(event) => {
                                               this.setState({typedMessage: event.target.value});
                                           }}/>
                            </td>
                            <td>
                                <Button variant="contained" color="primary"
                                        onClick={this.sendMessage}>Send</Button>
                            </td>
                        </tr>
                    </table>
                </div>
                <br/><br/>
                <div className="align-center">
                    {this.displayMessages()}
                </div>
                <SockJsClient url='http://localhost:8080/socket/'
                              topics={['/topic/getMessage']}
                              onConnect={() => {
                                  console.log("connected");
                              }}
                              onDisconnect={() => {
                                  console.log("Disconnected");
                              }}
                              onMessage={(msg) => {
                                  var jobs = this.state.messages;
                                  jobs.push(msg);
                                  this.setState({messages: jobs});
                                  console.log(this.state);
                              }}
                              ref={(client) => {
                                  this.clientRef = client
                              }}/>
            </div>
        )
    }
}

export default App;