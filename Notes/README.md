# Initial Status on TS Code Processing
2024-Sep-22 19:52

## PkTsCommon common-functions.ts

2024-Sep-22 19:53

The first test with Mistral & common-functions.ts was to just list the functions. Interestingly it only listed exported functions.
It took overnight, with the following results:

```
1. `isESM()`
2. `isCommonJS()`
3. `getStack(offset = 0)`
4. `stackParse()`
5. `stamp(entry?: any, frameAfter?: any)`
6. `getFrameAfterFunction(fname?: any, forceFunction?: any)`
7. `subObj(obj: GenericObject, fields: any[])`
8. `validateDateFnsDuration(obj)`
9. `strIncludesAny(str: string, substrs: any)`
10. `isPromise(arg?)`
11. `filterInt(value)`
12. `eventInfo(ev)`
13. `isNumeric(arg: any, asNum = false): number | boolean`
14. `asNumeric(arg): number | boolean`
15. `dtFmt(fmt:string = "short", dt?: any)`
16. `inArr1NinArr2(arr1: any[], arr2: any[])`
17. `intersect(a?: any[], b?: any[]): any[]`
18. `arrayToLower(arr: any[])`
19. `arraysEqual(a, b)`
20. `isSubset(a, b)`
21. `insertBetween(arr: Array<any>, item: any)`
22. `getRand(arr: any[])`
23. `getRandElsArr(arr: any[], cnt = null)`
24. `getRandEls(objorarr: GenObj | any[], cnt: number | null = null)`
25. `randInt(to: any, from:number = 0, cnt?:number): Number|Array<number>`
26. `parseHeaderString(str)`
27. `stripStray(str?: any)`
28. `toCamel(str)`
29. `toSnake(str)`
30. `toKebab(str)`
31. `kebabKeys(obj):GenObj`
32. `camelKeys(obj):GenObj`
33. `haversine(point1: GenObject | Array<number>, point2: GenObject | Array<number>): number | null`
34. `isIterableTest(arg)`
35. `dotNotationToObject(obj)`
36. `dotPathVal(obj, ...keyPaths)`
37. `cartesianProduct(...arrays)`
```