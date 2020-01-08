const rootNode = document.getElementById("root");

/** @jsx Tidact.createElement */
const element = (
  <div id="foo">
    <a> bar </a> <b />
  </div>
);

Tidact.render(element, rootNode);
