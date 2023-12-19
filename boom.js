function renderMineField(difficulty)
    let tableE1=document.querySelector('#mine-field')
    tableE1.innerHTML = ''; 
    if (!difficulty) {
    difficulty = 'easy';
    }
    let m,n,mineNums
    if (difficulty == 'easy') {
    m = 8;
    n = 8;
    mineNums = 10;
    } else if (difficulty == 'medium') {
    m = 12;
    n = 12;
    mineNums = 20;
    } else if (difficulty == 'hard') {
    m = 15;
    n = 15;
    mineNums = 40;
    } else if (difficulty == 'self') {
    m = parseInt(prompt("请输入行数(m):"));
    n = parseInt(prompt("请输入列数(n):"));
    mineNums = parseInt(prompt("请输入雷的数量(mineNums):"));
}
// 难易程度设置
document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮元素
    let easyBtn = document.getElementById('easy-btn');
    let mediumBtn = document.getElementById('medium-btn');
    let hardBtn = document.getElementById('hard-btn');
    let selfBtn = document.getElementById('self-btn');

    // 绑定点击事件处理程序
    easyBtn.addEventListener('mousedown', function() {
        renderMineField('easy');
      });
    mediumBtn.addEventListener('mousedown', function() {
        renderMineField('medium');
      });
    hardBtn.addEventListener('mousedown', function() {
        renderMineField('hard');
      });
    selfBtn.addEventListener('mousedown', function() {
        renderMineField('self');
      });
})
    let gameState={
        m,
        n,
        mineNums,
        remaining:null,
        timing:null,
        cells:null,
        gameOver:false
    }


    // 存储cell、row
    let cells=[];
    for (let i=0;i<gameState.m;i++){
        let trE1=document.createElement('tr');
        let row=[];
        for  (let j=0;j<gameState.n;j++){
            let tdE1=document.createElement('td');

            let cellE1=document.createElement('div')
            cellE1.className='cell unclear'
            cellE1.onclick=function(){
        // 游戏结束：
            if (gameState.gameOver){
                    return
        }
                handleClick(gameState,i,j)
            }
            cellE1.oncontextmenu=function(event){
            if (gameState.gameOver){
                return
            }
                handleFlagging(gameState,i,j)
                // 阻止右键页面出现
                event.preventDefault();
         }
            tdE1.append(cellE1) 
            row.push({
                mined:false,
                el:cellE1
            })
            trE1.append(tdE1)
        }
        console.log(cells)

        cells.push(row)
        tableE1.append(trE1)
    }
    gameState.cells=cells;
     let mineFields=randomMineFieldNo(gameState.m,gameState.n,gameState.mineNums);
    for (let cellNo of mineFields){
        // 将雷的号码设置成为几行几列
        let rowNo=Math.floor(cellNo/gameState.n)
        let colNo=cellNo%gameState.n

        let cell=cells[rowNo][colNo]
        cell.mined=true;

        let mineSpan=document.createElement('span');
        mineSpan.className='mine';
        mineSpan.innerText='*';

        cell.el.append(mineSpan)
    }
    checkAmbedianMinedCounts(gameState)

let restartButton = document.querySelector("#level");
restartButton.addEventListener("click", function() { 
    let timerE1=document.querySelector(".game-info>.timer")
    timerE1.innerText=""
    let mineCountEl = document.querySelector(".game-info>.remaining");
    mineCountEl.innerText = ""
    clearInterval(gameState.intervalID);
    renderMineField(difficulty)
    })
    let messageEl=document.querySelector(".game-info>.message");
    messageEl.innerHTML = "点击开始游戏"
    
    // 设置游戏重新开始
    let messageEl=document.querySelector(".game-info>.message");
    messageEl.innerText = "点击开始游戏";

    messageEl.onclick=function(){
        console.log('click')
        let tableE1=document.querySelector('#mine-field')
        tableE1.innerHTML=""
        renderMineField()
    }

// 建立坐标系
let directions=[
    [-1,-1],[0,-1],[1,-1],
    [-1,0],[1,0],
    [-1,1],[0,1],[1,1]
]
    // 检查数量 
function checkAmbedianMinedCounts(gameState){
    for (let rowIdx=0;rowIdx<gameState.m;rowIdx++){
        for  (let colIdx=0;colIdx<gameState.n;colIdx++){
            let cell=gameState.cells[rowIdx][colIdx]
            if (cell.mined){
                continue
            }

            // 找周边
            let mineCount=0
            for (let [drow,dcol] of directions){
                let newRowIdx=rowIdx+drow,newColIdx=colIdx+dcol;
                if (newRowIdx<0 || newRowIdx>=gameState.m ||
                    newColIdx<0 || newColIdx>=gameState.n){
                        continue
                    }
                if (gameState.cells[newRowIdx][newColIdx].mined){
                    mineCount+=1

                }
            }
                // 对雷周围进行数字填写
                if (mineCount>0){
                let countSpan=document.createElement('span');
                countSpan.className='mine-count';
                countSpan.innerText=`${mineCount}`;

                countSpan.classList.add(`n${mineCount}`)
                cell.el.append(countSpan)
            }
            cell.mineCount=mineCount
        } 
    }
}
// 随机布雷
function randomMineFieldNo(m,n,mineNums){
    // 以防保证雷数比格数还要多，导致网页崩溃，即为了保证逻辑正常存在，添加断言，使得逻辑有一个约束
    console.assert(mineNums<=m*n)
    let mines=[];
    for (let i=0;i<mineNums;i++){
        // 如果号包含在里边就继续，否则就重复进行循环
        let fieldNo;
        while (true){

        fieldNo=Math.floor(Math.random()*m*n);
        // 为了避免重复布雷，需要使用includes函数将已布雷号去除
        if (!mines.includes(fieldNo)){
        break;
            }
        }
        mines.push(fieldNo); 
    }
    return mines;
}
// 对雷进行标记：根据雷区的号判断计算在第几行第几列

// 处理点击事件
function handleClick(gameState,rowIdx,colIdx){
    // 面板赋值
    if (gameState.timing===null){
        startGame(gameState)
    }
    let cell=gameState.cells[rowIdx][colIdx]
    if (cell.mined){
        explode(gameState,rowIdx,colIdx)
    }else if (cell.mineCount==0){
        spreadSafeField(gameState,rowIdx,colIdx)
    }else if (cell.mineCount>0){
        // 如果没有点开，设置为true
        let cell=gameState.cells[rowIdx][colIdx]
        if (!cell.spreaded){
            cell.spreaded=true
            cell.el.classList.remove("unclear")
            cell.el.classList.add("spreaded")
        }
    }
    if (checkSuccess(gameState)){
        gameSuccess(gameState)
}
}
function startGame(gameState){
    let messageEl=document.querySelector(".game-info>.message");
    messageEl.innerText = "扫雷中";

    gameState.remaining=gameState.mineNums;
    let remainingE1=document.querySelector(".game-info>.remaining")
    remainingE1.innerHTML=`<span>${gameState.remaining}</span>`
    let timerE1=document.querySelector(".game-info>.timer")
    let secondsE1=document.createElement('span')
    timerE1.append(secondsE1);
    gameState.timing=0
    timerE1.innerText=`${gameState.timing}`
    // 设置计时器
    gameState.intervalID=setInterval(function(){
        gameState.timing+=1
        timerE1.innerText=`${gameState.timing}`
    },1000)
}
// 检查是否成功通关
function checkSuccess(gameState){
    let unspreadCount=0
    for (let rowIdx=0;rowIdx<gameState.m;rowIdx++){
        for (let colIdx=0;colIdx<gameState.n;colIdx++){
            let cell=gameState.cells[rowIdx][colIdx]
            if (cell.flag){
                continue
            }
            if (!cell.spreaded){
                unspreadCount+=1
            }
        }
    }
    return gameState.remaining===unspreadCount
} 
function explode(gameState){
// 爆炸消息
    for (let rowIdx=0;rowIdx<gameState.m;rowIdx++){
        for (let colIdx=0;colIdx<gameState.n;colIdx++){
            let cell=gameState.cells[rowIdx][colIdx]
        if (cell.mined){
            cell.exploded=true;
            cell.el.classList.add('exploded')
        }else{
            cell.el.classList.add('exploded')
            cell.el.classList.add('spreaded')
        }
        }
    }
    clearInterval(gameState.intervalID)
// 面板信息提示
    let messageEl=document.querySelector(".game-info>.message");
    messageEl.innerText = "游戏失败！";

    gameState.gameOver=true
}
function gameSuccess(gameState){
    for (let rowIdx=0;rowIdx<gameState.m;rowIdx++){
        for (let colIdx=0;colIdx<gameState.n;colIdx++){
            let cell=gameState.cells[rowIdx][colIdx]
        if (cell.mined){
            cell.exploded=true;
            cell.el.classList.add('success')
        }else{
            cell.el.classList.add('success')
            cell.el.classList.add('spreaded')
        }
        }
    }
    clearInterval(gameState.intervalID)
        let messageEl=document.querySelector(".game-info>.message");
        messageEl.innerText = "恭喜通关！";
        messageEl.classList.add('success')
        gameState.gameOver=true
    
}
