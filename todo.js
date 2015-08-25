var fs = require('fs');
var readline = require('readline');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var S = require('string');

var taskjson = require('./todo.json');
var tasks = taskjson.tasks;

var rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

function appendChars(src,total,char){
    var numChar = total - String(src).length;
    return src + S(char).repeat(numChar);
}

function printTasks(){
    console.log(chalk.bgBlue("\nyour current list of tasks:"));
    console.log(
        chalk.red("ITEM") + " | " + 
        chalk.green("DUE DATE") + "          | " +
        chalk.blue("TASK NAME"));
    tasks.forEach(function(item,num){
        var numstr,datestr,namestr;
        numstr = appendChars("#" + String(num), 5, " ");
        datestr= appendChars(" " + item.date, 19, " ");
        console.log(numstr+"|"+datestr+"| "+item.name);
    });
    console.log("__________________________");
    promptOptions();
}

function writeTasks(){
    try{
        fs.writeFileSync("./todo.json",'{ "tasks":' + JSON.stringify(tasks) + '}')

    } catch (err) {
        throw err;
        process.exit();
    }
}

function addTask(text,duedate){
    var task = {name:text,date:duedate||""};
    tasks.push(task);
    writeTasks();
    printTasks();
    promptOptions();
}

function promptAddTask(){
    var taskText;
    rl.question("Enter task: ",function(taskAnswer){
        taskText = taskAnswer;
        rl.question("Due date (blank for none): ", function(dateAnswer){
            console.log('answer type: ' + typeof dateAnswer)
            addTask(taskText, dateAnswer.toString());
        });
    });
}

function completeTask(num){
    if(+num <= tasks.length){
        tasks[remAnswer].status = "complete";
        writeTasks();
    } else {console.log('invalid task number'); promptOptions()}

}
function removeTask(num){
    if(+num < tasks.length){
        tasks.splice(num,1);
        writeTasks();
        printTasks();
        promptOptions();
    } else {console.log('invalid task number'); promptOptions()}

}

function promptRemoveTask(){
    rl.question("Enter task number to remove: ", function(remAnswer){
        removeTask(remAnswer);
    });
}

function promptOptions(){
    rl.question('choose an option: list, add, remove, quit: ',function(answer){
       parseArgs( [answer] );
    })
}

// parse args
function parseArgs(args){
    switch(args[0]){
        case "list":
            printTasks();
            break;
        case "add":
            if(args.length > 1)
                addTask(args[1],args[2]);
            else
                promptAddTask();
            break;
        //case "finish"
        case "remove":
            promptRemoveTask();
            break;
        //case "edit"
        case "quit":
            process.exit();
        default:
            printTasks();
            promptOptions();
    }
}

var todoArgs = Array.prototype.slice.call(process.argv, 2);
parseArgs(todoArgs);
