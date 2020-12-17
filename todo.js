const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');

const log = console.log;

const reader = readline.createInterface({
    input: process.stdin, // input from command line
    output: process.stdout,// output to command line
    prompt: ">"
});
console.clear();
reader.prompt();


const today = new Date();
const date = today.toLocaleDateString("en-US"); 

let tasks = [];
let count = 0;

let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

reader.on("line", data => {
    let cmd = data.split(" ").slice(0,2);
    cmd = cmd.join(" ");
    let tarr = data.split(" ").slice(2);
    
    if(cmd == "./todo" || cmd == "./todo help"){
       log(usage);
    }else if(cmd == "./todo add" && tarr.length > 0){
        let content = tarr.join(" ");
        tasks.push(content);
        log(chalk.green("Added todo: ", tasks[0]));
    }else if(cmd == "./todo ls"){
        if(tasks.length === 0){
            log(chalk.blue("No task to complete!!"));
            return;
        }
        log(chalk.magenta("Tasks to complete"));
        for(let i=tasks.length-1; i>=0; i--){
            log(chalk.green(`[${i + 1}] ${tasks[i]}`))
        }
    }else if(cmd == "./todo done" && tarr.length > 0){
        count++;
        let pos = Number.parseInt(tarr[0]);
        log(chalk.green(`Marked todo #${pos} as done.`));

        let myarr = [];
        for(let i=0; i<tasks.length; i++){
           if(pos - 1 != i){
               myarr.push(tasks[i]);
           }
        }
        tasks = myarr;
    }else if(cmd == "./todo report"){
        log(`${date} Pending : ${tasks.length} completed : ${count}`);
    }else if(cmd == "./todo del" && tarr.length > 0){
        let pos = Number.parseInt(tarr[0]);
        log(chalk.green(`Deleted todo #${pos}.`));

        let myarr = [];
        for(let i=0; i<tasks.length; i++){
           if(pos - 1 != i){
               myarr.push(tasks[i]);
           }
        }
        tasks = myarr;
    }else{
       log(chalk.red("Wrong command"));
    }

    reader.prompt();
});

reader.on("close", () => {
    log("Thank You for using our CLI");
})