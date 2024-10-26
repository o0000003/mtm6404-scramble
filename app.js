/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const wordsArray = ["apple", "banana", "cherry", "orange", "grape", "melon", "peach", "plum", "berry", "mango"];

function App() {
  const [scrambledWord, setScrambledWord] = React.useState("");
  const [input, setInput] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  const [words, setWords] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");

  React.useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("scrambleGameState"));
    if (savedState) {
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
      setWords(savedState.words);
    } else {
      setWords(shuffle(wordsArray));
    }
  }, []);

  React.useEffect(() => {
    if (words.length > 0) {
      setScrambledWord(shuffle(words[0]));
    }
  }, [words]);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setFeedback("")
    }, 1500)

    return (() => {
      clearTimeout(timeout)
    })
  }, [feedback])

  React.useEffect(() => {
    const gameState = { points, strikes, passes, words };
    localStorage.setItem("scrambleGameState", JSON.stringify(gameState));
  }, [points, strikes, passes, words]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleGuess = () => {
    if (input.toLowerCase() === words[0]) {
      setPoints(points + 1);
      setFeedback("Correct!");
      setWords(words.slice(1));
    } else {
      setStrikes(strikes + 1);
      setFeedback("Incorrect!");
    }
    setInput("");

    if (words.length === 1 || strikes === 2) {
      setGameOver(true);
    }
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      setWords(words.slice(1));
      setInput("");
    }
  };

  const handleRestart = () => {
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setWords(shuffle(wordsArray));
    setGameOver(false);
    setFeedback("");
  };

  return (
    <div className="game-container">
      <h1>Scramble Game</h1>
      {gameOver ? (
        <div>
          <p>Game Over! Your score: {points}</p>
          <button onClick={handleRestart}>Play Again</button>
        </div>
      ) : (
        <div>
          <p>Scrambled Word: {scrambledWord}</p>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleGuess()}
          />
          <button onClick={handleGuess}>Guess</button>
          <button onClick={handlePass} disabled={passes === 0}>Pass</button>
          <p>Feedback: {feedback}</p>
          <p>Points: {points}</p>
          <p>Strikes: {strikes}</p>
          <p>Passes Remaining: {passes}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
