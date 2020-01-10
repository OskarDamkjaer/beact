function createElement(type, props, ...children) {
    function createTextElement(text) {
        return {
            type: "TEXT_ELEMENT",
            props: {
                nodeValue: text,
                children: []
            }
        };
    }

    return {
        type,
        props: {
            ...props,
            children: children.map(c =>
                typeof c === "object" ? c : createTextElement(c)
            )
        }
    };
}

function performUnitOfWork(fiber) {
    function createDom(fiber) {
        const dom =
            fiber.type === "TEXT_ELEMENT" ?
            document.createTextNode("") :
            document.createElement(fiber.type);

        const isProp = k => k !== "children";
        Object.keys(fiber.props)
            .filter(isProp)
            .forEach(name => {
                dom[name] = fiber.props[name];
            });

        return dom;
    }

    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    // create new fibers
    const elements = fiber.props.children;
    const fibers = elements
        .map(el => ({
            type: el.type,
            props: el.props,
            parent: fiber,
            dom: null // We need to finish this before adding sibling
        }))
        .map((fiber, index, arr) => ({
            ...fiber,
            sibling: arr[index + 1] || null /* last one is index out bounds but it's fine*/
        }));

    fiber.child = fibers[0];

    // return next unit of work
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

function commitRoot() {
    function commitWork(fiber) {
        if (!fiber) {
            return;
        }

        const domParent = fiber.parent.dom;
        domParent.appendChild(fiber.dom);
        commitWork(fiber.child);
        commitWork(fiber.sibling);
    }

    commitWork(wipRoot.child);
    wipRoot = null;
}

requestIdleCallback(workLoop);

function render(element, container) {
    wipRoot = { dom: container, props: { children: [element] } };
    nextUnitOfWork = wipRoot;
}

const Tidact = { createElement, render };