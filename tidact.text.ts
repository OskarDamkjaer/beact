import Tidact from "./tidact";
const { createElement } = Tidact;

const Reset = "\x1b[0m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const redLog = (m: string) => console.log(`${FgRed}${m}${Reset}`);
const greenLog = (m: string) => console.log(`${FgGreen}${m}${Reset}`);

function test(name: string, real: any, expected: any): void {
  if (JSON.stringify(real) === JSON.stringify(expected)) {
    greenLog(name + " passed!");
  } else {
    redLog(
      `${name} failed: expected ${JSON.stringify(
        expected
      )}, got ${JSON.stringify(real)}`
    );
  }
}

function assert(name: string, toBeTrue: () => boolean) {
  if (toBeTrue()) {
    greenLog(name + " passed!");
  } else {
    redLog(`${name} failed`);
  }
}

test("one arg", createElement("div"), {
  type: "div",
  props: {
    children: []
  }
});

test("null mid arg", createElement("div", null, {}), {
  type: "div",
  props: {
    children: [{}]
  }
});

test("two extras", createElement("div", null, {}, 2), {
  type: "div",
  props: {
    children: [
      {},
      { type: "TEXT_ELEMENT", props: { nodeValue: 2, children: [] } }
    ]
  }
});
