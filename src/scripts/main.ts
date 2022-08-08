class Person {
    constructor(
      private readonly name: string,
      private readonly age: number,
      private readonly salary: number
    ) {}
  
    public toString(): string {
      return `Имя: ${this.name}\nВозраст: ${this.age}\nЗарплата: ${this.salary}`;
    }
  }