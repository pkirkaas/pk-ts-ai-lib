[[typeorm]] 

I am creating a `Employee` model/entity in TypeORM as below, with a one to many relationship with other employees (subordinates). 

The `Employee` model has a unique index `id`, but also a unique index `email`. I want the the relationship `subordinates` to be a one to many relationship, where each employee can have multiple subordinates - but the join field should be the unique `email` field rather than the `id` field.

Please provide an example of how to create the relationship in TypeORM, and how to query the relationship.

Employee Model:
```ts
export class Employee extends BaseEntity {
	@PrimaryGeneratedColumn() id: number,
  @Column({unique:true}) email:string,
  @Column() name:string,
  @OneToMany((type) => Employee, //This is where I need help - join on email
    subordinates: Employee[]
}
```

