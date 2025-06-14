import { Component } from "react";
import io from "socket.io-client";
import Popup from "reactjs-popup";

import "./App.css";

const socket = io.connect("http://localhost:3001");

const array = [
  { id: "1", content: "none" },
  { id: "2", content: "none" },
  { id: "3", content: "none" },
  { id: "4", content: "none" },
  { id: "5", content: "none" },
  { id: "6", content: "none" },
  { id: "7", content: "none" },
  { id: "8", content: "none" },
  { id: "9", content: "none" },
];

class App extends Component {
  state = {
    isPlaying: false,
    roomId: "",
    array: array,
    player: "",
    currentTurn: "",
    notFound: false,
    gameEndText: false,
  };

  componentDidMount() {
    socket.on("player1_joined", (data) => {
      this.setState({ player: data });
    });

    socket.on("player2_found_a_room_or_not", (data) => {
      this.setState({
        notFound: !data.isPresent,
        isPlaying: data.isPresent,
        currentTurn: data.player,
        player: data.player,
      });
    });

    socket.on("box_clicked_response", (data) => {
      const { array } = this.state;
      const newArray = array.map((j) =>
        j.id === data.id ? { ...j, content: data.content } : j
      );
      if (
        (newArray[0].content === "cross" &&
          newArray[1].content === "cross" &&
          newArray[2].content === "cross") ||
        (newArray[3].content === "cross" &&
          newArray[4].content === "cross" &&
          newArray[5].content === "cross") ||
        (newArray[6].content === "cross" &&
          newArray[7].content === "cross" &&
          newArray[8].content === "cross") ||
        (newArray[0].content === "cross" &&
          newArray[3].content === "cross" &&
          newArray[6].content === "cross") ||
        (newArray[1].content === "cross" &&
          newArray[4].content === "cross" &&
          newArray[7].content === "cross") ||
        (newArray[2].content === "cross" &&
          newArray[5].content === "cross" &&
          newArray[8].content === "cross") ||
        (newArray[0].content === "cross" &&
          newArray[4].content === "cross" &&
          newArray[8].content === "cross") ||
        (newArray[2].content === "cross" &&
          newArray[4].content === "cross" &&
          newArray[6].content === "cross") ||
        (newArray[0].content === "circle" &&
          newArray[1].content === "circle" &&
          newArray[2].content === "circle") ||
        (newArray[3].content === "circle" &&
          newArray[4].content === "circle" &&
          newArray[5].content === "circle") ||
        (newArray[6].content === "circle" &&
          newArray[7].content === "circle" &&
          newArray[8].content === "circle") ||
        (newArray[0].content === "circle" &&
          newArray[3].content === "circle" &&
          newArray[6].content === "circle") ||
        (newArray[1].content === "circle" &&
          newArray[4].content === "circle" &&
          newArray[7].content === "circle") ||
        (newArray[2].content === "circle" &&
          newArray[5].content === "circle" &&
          newArray[8].content === "circle") ||
        (newArray[0].content === "circle" &&
          newArray[4].content === "circle" &&
          newArray[8].content === "circle") ||
        (newArray[2].content === "circle" &&
          newArray[4].content === "circle" &&
          newArray[6].content === "circle")
      ) {
        this.setState({
          isPlaying: false,
          gameEndText: true,
          currentTurn: data.player,
        });
      }
      this.setState({
        currentTurn: data.player,
        array: newArray,
      });
    });
  }

  onClickedJoin = () => {
    const { roomId } = this.state;
    socket.emit("joining_room", roomId);
  };

  enteringRoomId = (e) => {
    this.setState({ roomId: e.target.value, notFound: false });
  };

  onClickedCreate = () => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let createdRoomId = "";
    for (let i = 0; i < 6; i++) {
      createdRoomId +=
        characters[Math.floor(Math.random() * characters.length)];
    }
    socket.emit("creating_room", createdRoomId);
    this.setState({ roomId: createdRoomId, isPlaying: true });
  };

  render() {
    const {
      roomId,
      isPlaying,
      array,
      currentTurn,
      player,
      notFound,
      gameEndText,
    } = this.state;
    return (
      <div className="main-cont">
        {!isPlaying && !gameEndText ? (
          <div className="inp-cont">
            <button
              type="button"
              onClick={this.onClickedCreate}
              className="create-btn"
            >
              Create Room
            </button>
            <p> OR </p>
            <input
              placeholder="Enter 6 digit room id"
              onChange={this.enteringRoomId}
              className="inp"
            />
            <button
              type="button"
              onClick={this.onClickedJoin}
              className="join-btn"
            >
              Join Room
            </button>
            {notFound && <p className="not-found">Room Not Found</p>}
          </div>
        ) : null}
        {isPlaying || gameEndText ? (
          <>
            <p className="room-id">
              Room ID : <span className="span-ele">{roomId}</span>
            </p>
            {isPlaying && (
              <>
                {currentTurn === player ? (
                  <p className="y-t">Your Turn</p>
                ) : (
                  <p className="o-t">Opponent Turn</p>
                )}
              </>
            )}
            <ul className="game-cont">
              {array.map((i) => (
                <li className="box" key={i.id}>
                  <button
                    type="button"
                    className="box-btn"
                    onClick={
                      i.content === "none" &&
                      currentTurn === player &&
                      isPlaying
                        ? () => {
                            socket.emit("box_clicked", {
                              id: i.id,
                              roomId: roomId,
                            });
                          }
                        : undefined
                    }
                  >
                    {i.content !== "none" && (
                      <img
                        src={
                          i.content === "cross"
                            ? "https://res.cloudinary.com/dnxaaxcjv/image/upload/v1749567596/Screenshot_2025-06-10_123948_tezqum.png"
                            : "https://res.cloudinary.com/dnxaaxcjv/image/upload/v1749567609/Gemini_Generated_Image_kcp6v0kcp6v0kcp6_yhe415.png"
                        }
                        alt="cross or circle"
                        className="box-img"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {gameEndText && (
              <>
                {currentTurn !== player ? (
                  <h1 className="y-w">You Won The Game </h1>
                ) : (
                  <h1 className="o-w">Opponent Won The Game </h1>
                )}
              </>
            )}
            {gameEndText && (
              <>
                {currentTurn !== player ? (
                  <Popup modal open={gameEndText}>
                    {
                      <div className="pp-cont">
                        <p className="emoji">😃</p>
                        <h1 className="y-w">You Won The Game </h1>
                      </div>
                    }
                  </Popup>
                ) : (
                  <Popup modal open={gameEndText}>
                    {
                      <div className="pp-cont">
                        <p className="emoji">☹️</p>
                        <h1 className="o-w">Opponent Won The Game </h1>
                      </div>
                    }
                  </Popup>
                )}
              </>
            )}
          </>
        ) : null}
      </div>
    );
  }
}

export default App;
