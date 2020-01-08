# reading

## main guide:

https://pomb.us/build-your-own-react/

## understanding fiber

### https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html

The objects we are creating from jsx are the output of the function inputs (props). ReactDom will later do the actual rendering.
An element is a plain object describing what you would like to see in terms of dom nodes / components.

a component creates elements from props.

### https://reactjs.org/docs/reconciliation.html

the algorithm for reconsil uses the following heuristics:

1.  Two elements of different types will produce different trees.
2.  The developer can hint at which child elements may be stable across different renders with a key prop.

knowing what to rerender and component instances (this/state) is reused in lists based on the item keys.

### https://github.com/reactjs/react-basic

x

### https://reactjs.org/docs/design-principles.html

x

### https://github.com/acdlite/react-fiber-architecture

"That's the purpose of React Fiber. Fiber is reimplementation of the stack, specialized for React components. You can think of a single fiber as a virtual stack frame.""

## react as a UI-runtime och mer från overreacted
