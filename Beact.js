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

function reconcileChildren(parentFiber, children) {
    function traverse(oldFiber, correspondingIndex) {
        if (!(correspondingIndex < childrenToRenderArr.length || oldFiber)) {
            return;
        }
        let newFiber = null;
        const newElement = childrenToRenderArr[correspondingIndex];

        // if same type, change props, otherwise rerender fiber
        const sameType =
            oldFiber && newElement && oldFiber.type === newElement.type;

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: newElement.props,
                dom: oldFiber.dom,
                parent: parentFiber,
                oldFiber,
                effectTag: "UPDATE"
            };
        } else if (oldFiber) {
            oldFiber.effectTag = "DELETE";
            toDelete.push(oldFiber);
        } else if (newElement) {
            newFiber = {
                type: newElement.type,
                props: newElement.props,
                dom: null,
                parent: parentFiber,
                oldFiber: null,
                effectTag: "APPEND"
            };
        }

        if (correspondingIndex === 0) {
            parentFiber.child = newFiber;
        } else if (newElement) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;

        const nextIndex = correspondingIndex + 1;
        const nextOldFiber = oldFiber && oldFiber.sibling;

        traverse(nextOldFiber, nextIndex);
    }

    const childrenLastRenderedLL =
        parentFiber.oldFiber && parentFiber.oldFiber.child; // oldFiber is null on first render
    const childrenToRenderArr = children;
    let prevSibling = null;

    traverse(childrenLastRenderedLL, 0);
}

function isEventHandler(key) {
    return key.startsWith("on");
}

function isProp(key) {
    return key !== "children" && !isEventHandler(key);
}

function performUnitOfWork(fiber) {
    const isFunctionComponent = fiber.type instanceof Function;
    isFunctionComponent
        ?
        updateFunctionComponent(fiber) :
        updateSimpleComponent(fiber);

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

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    const children = [fiber.type(fiber.props)];

    reconcileChildren(fiber, children);
}

function useState(inital) {
    const oldHook =
        wipFiber.oldFiber &&
        wipFiber.oldFiber.hooks &&
        wipFiber.oldFiber.hooks[hookIndex];

    const hook = { state: oldHook ? oldHook.state : inital, queue: [] };
    wipFiber.hooks.push(hook);
    hookIndex += 1;

    const actions = oldHook ? oldHook.queue : [];

    actions.forEach(action => {
        const isFn = action instanceof Function;
        hook.state = isFn ? action(hook.state) : action;
    });

    const setState = action => {
        // set state is just push an action and call for rerender
        // *mind blown*
        hook.queue.push(action);
        wipRoot = {
            dom: lastCommitedRoot.dom,
            props: lastCommitedRoot.props,
            oldFiber: lastCommitedRoot
        };
        nextUnitOfWork = wipRoot;
        toDelete = [];
    };

    return [hook.state, setState];
}

function updateSimpleComponent(fiber) {
    function createDom(fiber) {
        const dom =
            fiber.type === "TEXT_ELEMENT" ?
            document.createTextNode("") :
            document.createElement(fiber.type);

        Object.keys(fiber.props)
            .filter(isProp)
            .forEach(name => {
                dom[name] = fiber.props[name];
            });

        Object.keys(fiber.props)
            .filter(isEventHandler)
            .forEach(name => {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, fiber.props[name]);
            });

        return dom;
    }

    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    // create new fibers
    const children = fiber.props.children;
    reconcileChildren(fiber, children);
}

let nextUnitOfWork = null;
let wipRoot = null;
let lastCommitedRoot = null;
let toDelete = [];

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

        // functional components don't have domParents, we need to traverse
        function findNearestDomParent(fiber) {
            return fiber.parent.dom ?
                fiber.parent.dom :
                findNearestDomParent(fiber.parent);
        }
        const domParent = findNearestDomParent(fiber);

        if (fiber.effectTag === "APPEND" && fiber.dom != null) {
            domParent.appendChild(fiber.dom);
        } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
            updateDom(fiber.dom, fiber.oldFiber.props, fiber.props);
        } else if (fiber.effectTag === "DELETE") {
            function commitDeletion(fiber, domParent) {
                if (fiber.dom) {
                    domParent.removeChild(fiber.dom);
                } else {
                    commitDeletion(fiber.child, domParent);
                }
            }
            commitDeletion(fiber, domParent);
        }

        commitWork(fiber.child);
        commitWork(fiber.sibling);
    }

    toDelete.forEach(commitWork);
    commitWork(wipRoot.child);
    lastCommitedRoot = wipRoot;
    wipRoot = null;
}

function updateDom(dom, oldProps, newProps) {
    const isNew = (prev, next) => key => prev[key] !== next[key];
    const isGone = (_prev, next) => key => !(key in next);
    console.log(dom, oldProps, newProps);

    //Remove old or changed event listeners
    Object.keys(oldProps)
        .filter(isEventHandler)
        .filter(key => !(key in newProps) || isNew(oldProps, newProps)(key))
        .forEach(name => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, oldProps[name]);
        });

    // Remove old properties
    Object.keys(oldProps)
        .filter(isProp)
        .filter(isGone(oldProps, newProps))
        .forEach(name => {
            dom[name] = "";
        });

    // Set new or changed properties
    Object.keys(newProps)
        .filter(isProp)
        .filter(isNew(oldProps, newProps))
        .forEach(name => {
            dom[name] = newProps[name];
        });

    // Add event listeners
    Object.keys(newProps)
        .filter(isEventHandler)
        .filter(isNew(oldProps, newProps))
        .forEach(name => {
            console.log("adding ", name);
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, newProps[name]);
        });
}

requestIdleCallback(workLoop);

function render(element, container) {
    wipRoot = {
        dom: container,
        props: { children: [element] },
        oldFiber: lastCommitedRoot
    };
    nextUnitOfWork = wipRoot;
    toDelete = [];
}

const Beact = { createElement, render, useState };