
const { stdin } = require('process');
const readline = require('readline');

const read = readline.createInterface({
    input : process.stdin,
    output : process.stdout
})

let arr = ["Jungle Book","2 States","Half Girlfriend","Revolution 20-20"]


function call(){
    read.question("Enter key - 1 or 2 or 3  ", function(inp){
        if(inp == "1"){
            arr.forEach(ele => {
                console.log(ele);
            });
            call();
        }
        else if(inp == "2"){
            read.question("add the name of the book ", (inp)=>{
                arr.push(inp);
                console.log("Book added ");
                call();
            })    
        }
        else if(inp == "3") {
            read.question("Are you sure you want to quit - press Y to quit ",function(inp){
                if(inp == "Y"){
                    read.close();
                }
                else{
                    console.log("wrong keyword");
                    call()
                }
            })
        }
        else {
            console.log("You have selected an invalid entry so please press 1, 2 or 3 ");
            call()
        }
    })
}

call()

read.on("close",()=>{
    console.log("Bye Bye");
})