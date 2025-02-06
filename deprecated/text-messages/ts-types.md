[[ts]] In the latest typescript, please provide an in depth explanation of `type` and `interface`, how they are different, and pros and cons of each.

Give an example of each for the following object signature:

The object can have the following properties, all optional. Each property can have only a single string value, only specific string values are allowed for each property.

Something like:
```ts
{
  fd?: 'r' | 'c',
  wr?: 'r' | 'n',
  ai?: 's' | 'e' | 'c' | 'g' | 'b',
  jc?: 's' | 'c' | 'e' | 'b' | 'a',
}
```
I get a typescript compile error for the following code:
```ts
export interface StyleBuilderFlexArgs {
  fd?: 'r' | 'c',
  wr?: 'w' | 'n',
  ai?: 's' | 'e' | 'c' | 'g' | 'b',
  jc?: 's' | 'c' | 'e' | 'b' | 'a',
}

export function build(flexOptspts:StyleBuilderFlexArgs = {}) {
  let defaults: StyleBuilderFlexArgs = { fd: 'r', wr: 'w', ai: 's', jc: 's' };
  let rFlexOpts: StyleBuilderFlexArgs = { ...defaults, ...flexOpts };
  console.log({rFlexOpts});
}

let fOpts = {fd:'c', wr:'n', ai:'c', jc:'b',};
let fs1 = build(fOpts);
```

I get the TypeScript error:
```
error TS2345: Argument of type '{ fd: string; wr: string; ai: string; jc: string; }' is not assignable to parameter of type 'StyleBuilderFlexArgs'.
  Types of property 'fd' are incompatible.
    Type 'string' is not assignable to type '"r" | "c"'.
```

Please explain & fix

