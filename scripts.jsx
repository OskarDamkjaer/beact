const rootNode = document.getElementById("root");
/** @jsx Tidact.createElement */
const element1 = (
  <div id="foo">
    <a> bar </a>
    <b> k </b>
  </div>
);

/** @jsx Tidact.createElement */
function App(props) {
  return <h1>Hello {props.name}</h1>;
}
const element = (
  <div>
    haj du <App name="world" />
  </div>
);

Tidact.render(element, rootNode);
