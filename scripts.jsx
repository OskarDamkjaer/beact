const rootNode = document.getElementById("root");

/** @jsx Tidact.createElement */
/*
const element1 = (
  <div id="foo">
    <a> bar </a>
    <b> k </b>
  </div>
);
*/

/** @jsx Tidact.createElement */
function App(props) {
  return <h1>Hello {props.name}</h1>;
}
const element = (
  <div id="a">
    aj du
    <App name="world" />
    <Counter />
  </div>
);

/** @jsx Tidact.createElement */
function Counter() {
  const [count, setCount] = useState(0);

  /** @jsx Tidact.createElement */
  return (
    <button onClick={() => setCount(c => c + 1)}>
      I've been clicked {count} times!
    </button>
  );
}

Tidact.render(element, rootNode);
