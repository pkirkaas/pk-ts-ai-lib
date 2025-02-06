[[ts]] 

I have several object declarations in TypeScript I would like to use to derive TS Types or Interfaces. I would like to use the derived type/interface to specify the argument type for a function.

In particular, I want to be clever by declaring a default object argument for a function, and use that default object as a type for the function argument - where all keys are optional.

I have tried:
```ts
let defaultObj = {a:1, b:2, c:3};
type DefaultObjType = Partial< typeof defaultObj>;
function foo(opts: DefaultObjType={}) {
  let r = {...defaultObj, ...opts};
  console.log(r);
}
```

But I get the error:
```
error TS2322: Type '{}' is not assignable to type 'DefaultObjType'.
```

How can I get this to work?



{|
```ts
const whereKeys = {
    t: "Top",
    b: "Bottom",
    l: "Left",
    r: "Right",
    v: ["Top", "Bottom"],
    y: ["Top", "Bottom"],
    h: ["Left", "Right"],
    x: ["Left", "Right"],
  };

type WhereKeyType = keyof typeof whereKeys;

function getWhereKeyVal(key:WhereKeyType) {
  return whereKeys[key];
}

```
|}