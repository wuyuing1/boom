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

