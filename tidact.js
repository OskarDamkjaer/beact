function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(c =>
                typeof c === "object" ? c : createTextNode(c)
            )
        }
    };
}

function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    };
}

function render(element, container) {
    const node = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)

    const isProp = k => k !== "children"
    Object.keys(element.props).filter(isProp).forEach(name => { node[name] = element.props[name] })

    element.props.children.forEach(c => render(c, node))

    container.appendChild(node)
}

const Tidact = { createElement, render };