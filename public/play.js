class Com {
    constructor(selector){
        this.loc = document.querySelector(`.com.${selector}`);
    }
}

class Human {
    constructor(selector){
        this.name = selector;
        this.loc = document.querySelector(`.human.${selector}`);
        this.choose();
        this.reset();
    }
    
    choose = () => {
        let name = this.name;
        this.loc.addEventListener('click', function(){
            let humanTokens = document.querySelectorAll('.human.token');
            humanTokens.forEach(token => {
                token.classList.remove('active');
                token.setAttribute("disabled","");
            });
            

            this.classList.add("active");

            let numb = Math.floor(Math.random()*3);
            let rand;
    
            switch (numb){
                case 0 :
                    rand = "rock";
                    break;
                case 1 :
                    rand = "paper";
                    break;
                case 2 :
                    rand = "scissor";
                    break;
                }
            
            let comTokens = document.querySelectorAll('.com.token');
            comTokens.forEach(token => {
                token.classList.remove('active');
                
            })

            document.querySelector(`.com.token.${rand}`).classList.add('active');

            let result;

            console.log('You choose ' + name);
            console.log('Computer choose ' + rand);
            

            switch (name){
                case "rock" :
                    switch (rand) {
                        case "rock" :
                            result = "DRAW";
                            break;
                        case "paper" :
                            result = "YOU LOSE";
                            break;
                        case "scissor" :
                            result = "YOU WIN";
                            break;

                        };
                    break;

                case "paper" :
                     switch (rand) {
                        case "rock" :
                            result = "YOU WIN";
                            break;
                        case "paper" :
                            result = "DRAW";
                            break;
                        case "scissor" :
                            result = "YOU LOSE";
                            break;
    
                        };
                    break;
                    
                case "scissor" :
                    switch (rand) {
                        case "rock" :
                            result = "YOU LOSE";
                            break;
                        case "paper" :
                            result = "YOU WIN";
                            break;
                        case "scissor" :
                            result = "DRAW";
                            break;
    
                        };
                    break;
            }
            

            document.querySelector('.start').classList.add('hidden');
            document.querySelector('.game.result').classList.remove('hidden');
            document.querySelector('.game.result').innerHTML = result;
            let date = new Date()
            let score = result.slice(-4)

            document.querySelector('.result-box').innerHTML += `<div class="result game001">
            <div class="score">${score}</div>
            <div class="date">${date}</div>
        </div>`
            
            
            
            
            document.querySelector('.reset').addEventListener('click', function(){
                
                humanTokens.forEach(token => {
                    token.classList.remove('active');
                    token.removeAttribute("disabled");
                })
                comTokens.forEach(token => {
                    token.classList.remove('active');
                })

                document.querySelector('.start').classList.remove('hidden');
                document.querySelector('.game.result').classList.add('hidden');

            })
            
        })
    }

    reset = () => {
        document.querySelector('body').addEventListener('click', function(e){
            if (e.target.classList.value == 'humans'){
                
        
                document.querySelector('.reset img').classList.add('blink');
        
                setTimeout(function(){
                    document.querySelector('.reset img').classList.remove('blink');
                    },1000)
                
            }
            
        })
    }
}


let comRock = new Com('rock');
let comPaper = new Com('paper');
let comScissor = new Com ('scissor');

let humanRock = new Human('rock');
let humanPaper = new Human('paper');
let humanScissor = new Human ('scissor');



