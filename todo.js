/*
    Author - Abhay Chauhan
    This Script/Program is written as a part of CoronaSafe Engineering Fellowship Test Problem in the JavaScript Programming Language passing all the test cases as given in the todo.test.js file.
*/

const fs = require('fs');
const chalk = require('chalk');

const log = console.log;

const usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}

const today = new Date();
const date = date2str(today, 'yyyy-MM-dd');

let tasks = [];
let done = [];
const FILE_PATH_TASK = "./todo.txt";
const FILE_PATH_DONE = "./done.txt";

if(fs.existsSync(FILE_PATH_TASK)){
    let data = fs.readFileSync('todo.txt', 'utf-8').split("\n");
    let j = 0;
    for(let i=0; i<data.length; i++){
        if(data[i] === "") continue;
        tasks[j] = data[i];
        j++;
    }
}

if(fs.existsSync(FILE_PATH_DONE)){
    let data = fs.readFileSync('done.txt', 'utf-8').split("\n");
    let j = 0;
    for(let i=0; i<data.length; i++){
        if(data[i] === "") continue;
        done[j] = data[i];
        j++;
    }
}

function printHelp(){
    log(usage);
}

function addItem(data){
    tasks.push(data);
    fs.appendFileSync(FILE_PATH_TASK, data + "\n");
    log(chalk.green("Added todo:", `"${data}"`));
}

function displayList(){
    if(tasks.length === 0){
        log(chalk.blue("There are no pending todos!"));
        return;
    }
    log(chalk.magenta("Tasks to complete"));
    for(let i=tasks.length-1; i>=0; i--){
        if(tasks[i] === "") continue;
        log(chalk.green(`[${i + 1}] ${tasks[i]}`))
    }
}

function delItem(pos){
    pos = Number.parseInt(pos);
    if(pos > tasks.length || pos === 0){
        console.log("Error: todo #" + pos + " does not exist. Nothing deleted.");
        return;
    }
    log(chalk.green("Deleted todo #" + pos + "."));

    fs.unlinkSync(FILE_PATH_TASK);

    let myarr = [];
    for(let i=0; i<tasks.length; i++){
        if(pos - 1 != i){
            myarr.push(tasks[i]);
            fs.appendFileSync(FILE_PATH_TASK, tasks[i] + "\n");
        }
    }
    tasks = myarr;
}

function markDone(pos){
    pos = Number.parseInt(pos);
    if(pos > tasks.length || pos === 0){
        log("Error: todo #" + pos + " does not exist.");
        return;
    }
    log(chalk.green("Marked todo #" + pos + " as done."));

    fs.appendFileSync(FILE_PATH_DONE, tasks[pos-1] + "\n");
    done.push(tasks[pos-1]);
    
    fs.unlinkSync(FILE_PATH_TASK);

    let myarr = [];
    for(let i=0; i<tasks.length; i++){
        if(pos - 1 != i){
            myarr.push(tasks[i]);
            fs.appendFileSync(FILE_PATH_TASK, tasks[i] + "\n");
        }
    }
    tasks = myarr;
}

function getReport(){
    log(`${date} Pending : ${tasks.length} Completed : ${done.length}`);
}

const cmd = process.argv[2];
const argv = process.argv[3];
const arr = process.argv;

if(arr.length === 2 || cmd === "help"){
    printHelp();
}else if(cmd === "add"){
    if(arr.length > 3){
        addItem(argv);
    }else{
        log("Error: Missing todo string. Nothing added!");
    }
}else if(cmd === "ls"){
    displayList();
}else if(cmd === "done"){
    if(arr.length > 3){
        markDone(argv);
    }else{
        log("Error: Missing NUMBER for marking todo as done.");
    }
}else if(cmd === "report"){
    getReport();
}else if(cmd === "del"){
    if(arr.length > 3){
        delItem(argv);
    }else{
        log("Error: Missing NUMBER for deleting todo.");
    }
}else{
    log('Wrong Command. Kindly use "./todo help" for available commands');
}