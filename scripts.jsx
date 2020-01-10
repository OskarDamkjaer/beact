/** @jsx Beact.createElement */
function Square({ mark = "", handleClick }) {
  return (
    <button onClick={handleClick} className="square">
      {mark}
    </button>
  );
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  function renderSquare(i) {
    return <Square handleClick={() => handleClick(i)} mark={squares[i]} />;
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const sq = squares.slice();
    sq[i] = xIsNext ? "X" : "O";
    setSquares(sq);
    setXIsNext(!xIsNext);
  }

  function restart() {
    setXIsNext(true);
    setSquares(Array(9).fill(null));
  }

  const winner = calculateWinner(squares);
  const draw = squares.filter(a => a).length === 9 && !winner;
  let status = `Next player: ${xIsNext ? "X" : "O"}`;
  if (draw) {
    status = "It's a draw, play again?";
  } else if (winner) {
    status = `${xIsNext ? "O" : "X"} wins!`;
  }
  const gameOver = winner || draw || null; // false is rendered as string

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {gameOver && <button onClick={restart}>Play again?</button>}
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const rootNode = document.getElementById("root");
Beact.render(<Game />, rootNode);
