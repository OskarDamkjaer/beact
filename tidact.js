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

const Tidact = { createElement };