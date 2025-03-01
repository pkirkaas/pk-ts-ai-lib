[[ts]]

I am an experienced TypeScript developer, but I would like to learn a few more advanced techniques in detail and in depth.

For example, I want to explore some general pattern to define a typescript function that accepts named, typed parameters, some optional, some required, some with default values.

I want this in the most compact way - ideally without having to declare a separate `interface` or `type` for the function parameters.

For example (these values & parameters are arbitrary) - how would I define and call a TypeScript function with the following parameters:

```ts
{
fname:string, // Required
lname:string, // Default: "Jones"
age?:number|string, // Optional, no default
friends:string|string[], // can accept string or string[], but with default="23 Nov 2020"
}

function ({fname,lname="Jones",age,friends}) { // This isn't valid TypeScript
  let nickname = fname;
  console.log({nickname, fname, lname, age, friends});
}
```

Please provide several examples of how to define and call the function as described above, with particular focus on the most compact, least verbose implementation possible.



