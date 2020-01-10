const rootNode = document.getElementById("root");

/** @jsx Beact.createElement */
function App(props) {
  return <h1>Hello {props.name}</h1>;
}

const element = (
  <div id="a">
    haj du
    <App name="world" />
    <Counter />
  </div>
);

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      I've been clicked {count} times!
    </button>
  );
}

Beact.render(element, rootNode);
