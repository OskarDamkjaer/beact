const rootNode = document.getElementById("root");
/** @jsx Tidact.createElement */
const element = (
  <div id="foo">
    <a> bar </a>
    <b> k </b>
  </div>
);

/** @jsx Tidact.createElement */
/*
function App(props) {
  return <h1>Hello {props.name}</h1>;
}
const element = <App name="world" />;
*/

Tidact.render(element, rootNode);
