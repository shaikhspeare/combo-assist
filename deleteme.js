function outer() {
    let counter = 0;
    function increment() {
        console.log(counter);
        
        counter++;
    }
    return increment;
}

const myFunc = outer();
myFunc();
myFunc();

const anotherFunc = outer();
anotherFunc();
anotherFunc();