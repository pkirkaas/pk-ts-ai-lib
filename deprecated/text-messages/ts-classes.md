[[ts]] I do very abstract work with JavScript classes, extended classes, static and instance methods and properties. I want to access static properties and methods from an instance of a class.

However, I don't want to use the class name to access the properties, since I may be in an extended class. Simple example:

```js
class Parent {
	static label = "Parent Label";
	logLabel() {
		console.log(`The class label:`,this.constructor.label);
		return this.constructor.label;
	}
}

class Child extends Parent {
	static label = "Child Label";
};
let aChild = new Child();
aChild.logLabel(); // Outputs: The class label: Child Label
```
This works perfectly in JavaScript. But in TypeScript, I get the following error:

` error TS2339: Property 'label' does not exist on type 'Function'`

I can achieve what I want in typescript as below:

```ts
class A {
  thisClass:any;
  static cname = 'A';
  constructor() {
    this.thisClass = this.constructor;
  }
  sayName() {
    console.log(`${this.thisClass.cname} says hello`);
  }
 }

class B extends A {
  static cname = 'B';
}
let b = new B();
b.sayName(); // B says hello
```

but this doesn't take advantage of TypeScript type checking.

Is there any way to get the actual class type from the instance?

Please think carefully and be creative - this is a very fundimental issue - basically for TypeScript.




