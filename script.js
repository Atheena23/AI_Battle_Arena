const COLS=18, ROWS=11;
const arena=document.getElementById("arena");
const difficultyEl=document.getElementById("difficulty");
const statusEl=document.getElementById("status");
const aiStateEl=document.getElementById("aiState");
const nodesEl=document.getElementById("nodes");
const pathLengthEl=document.getElementById("pathLength");
const heuristicEl=document.getElementById("heuristic");
const fscoreEl=document.getElementById("fscore");
const targetsEl=document.getElementById("targets");
const toastEl=document.getElementById("toast");
const countdownOverlay=document.getElementById("countdownOverlay");
const countdownNumber=document.getElementById("countdownNumber");

let grid=[], player={x:1,y:9}, enemy={x:16,y:1}, items=[];
let path=[], showPath=true, paused=false, score=0, collected=0, startTime=Date.now(), gameOver=false;
let aiTimer=null, clockTimer=null, countdownTimer=null, round=1;
let countdownActive=false;

const dirs=[[1,0],[-1,0],[0,1],[0,-1]];

function key(x,y){return `${x},${y}`}
function manhattan(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>toastEl.classList.remove("show"),1700)}

function makeGrid(){
  grid=Array.from({length:ROWS},()=>Array(COLS).fill(0));
  // deterministic-ish walls, leaving corridors
  const walls=[
    [3,1],[4,1],[5,1],[7,1],[8,1],[11,1],[12,1],[14,1],
    [3,2],[7,2],[8,2],[12,2],[14,2],
    [1,3],[2,3],[3,3],[5,3],[8,3],[9,3],[12,3],[14,3],[15,3],
    [5,4],[9,4],[12,4],
    [1,5],[2,5],[3,5],[5,5],[7,5],[9,5],[10,5],[12,5],[14,5],[15,5],
    [3,6],[5,6],[7,6],[12,6],
    [3,7],[7,7],[8,7],[10,7],[12,7],[14,7],[15,7],
    [1,8],[3,8],[5,8],[8,8],[10,8],[12,8],
    [1,9],[3,9],[5,9],[7,9],[10,9],[12,9],[14,9],
    [7,10],[10,10],[14,10]
  ];
  walls.forEach(([x,y])=>grid[y][x]=1);
  // keep spawn points open
  grid[player.y][player.x]=0; grid[enemy.y][enemy.x]=0;
}
function randomFree(){
  for(let i=0;i<1000;i++){
    const x=1+Math.floor(Math.random()*(COLS-2)),y=1+Math.floor(Math.random()*(ROWS-2));
    if(!grid[y][x] && !(x===player.x&&y===player.y) && !(x===enemy.x&&y===enemy.y) && !items.some(it=>it.x===x&&it.y===y)) return {x,y};
  }
  return {x:9,y:9};
}
function spawnItems(){
  items=[];
  const types=["health","weapon","health","weapon","health","weapon","health"];
  types.forEach((type,i)=>{const p=randomFree();items.push({...p,type,value:type==="weapon"?35:20,id:i});});
}
function render(){
  arena.innerHTML="";
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const c=document.createElement("div");c.className="cell";
    if(grid[y][x])c.classList.add("wall");
    if((x===0&&y===0)||(x===17&&y===10))c.classList.add("safe");
    if(showPath && path.some(p=>p.x===x&&p.y===y))c.classList.add("path");
    if(x===player.x&&y===player.y){const e=document.createElement("div");e.className="entity player";e.textContent="◆";c.appendChild(e)}
    if(x===enemy.x&&y===enemy.y){const e=document.createElement("div");e.className="entity enemy";e.textContent="AI";c.appendChild(e)}
    const it=items.find(i=>i.x===x&&i.y===y);
    if(it){const e=document.createElement("div");e.className=`item ${it.type}`;e.textContent=it.type==="health"?"✚":"✦";c.appendChild(e)}
    arena.appendChild(c);
  }
}
function reconstruct(came,current){
  const out=[current];
  while(came.has(key(current.x,current.y))){current=came.get(key(current.x,current.y));out.push(current)}
  return out.reverse();
}
function aStar(start,goal){
  const open=[{...start}], came=new Map(), g=new Map([[key(start.x,start.y),0]]);
  const f=new Map([[key(start.x,start.y),manhattan(start,goal)]]);
  const closed=new Set(); let explored=0;
  while(open.length){
    open.sort((a,b)=>(f.get(key(a.x,a.y))??Infinity)-(f.get(key(b.x,b.y))??Infinity));
    const cur=open.shift(), ck=key(cur.x,cur.y);
    if(closed.has(ck))continue;
    closed.add(ck); explored++;
    if(cur.x===goal.x&&cur.y===goal.y){
      const result=reconstruct(came,cur);
      return {path:result,explored};
    }
    for(const [dx,dy] of dirs){
      const nx=cur.x+dx,ny=cur.y+dy;
      if(nx<0||ny<0||nx>=COLS||ny>=ROWS||grid[ny][nx])continue;
      const nk=key(nx,ny),ng=(g.get(ck)||0)+1;
      if(ng<(g.get(nk)??Infinity)){
        came.set(nk,cur);g.set(nk,ng);f.set(nk,ng+manhattan({x:nx,y:ny},goal));
        open.push({x:nx,y:ny});
      }
    }
  }
  return {path:[],explored};
}
function updateAIMetrics(){
  const r=aStar(enemy,player);path=r.path;nodesEl.textContent=r.explored;
  pathLengthEl.textContent=r.path.length?Math.max(0,r.path.length-1):"—";
  const h=manhattan(enemy,player);heuristicEl.textContent=h;
  fscoreEl.textContent=r.path.length?`${(r.path.length-1)+h}`:"—";
  render();
}
// ===============================
// DAA CONCEPT: QUICK SORT
// ===============================

function quickSort(arr, scoreFn){
  if(arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for(let i = 0; i < arr.length - 1; i++){
    if(scoreFn(arr[i]) >= scoreFn(pivot)){
      left.push(arr[i]);
    }else{
      right.push(arr[i]);
    }
  }

  return [
    ...quickSort(left, scoreFn),
    pivot,
    ...quickSort(right, scoreFn)
  ];
}

function runQuickSort(){
  const candidates = items.map(it => ({
    ...it,
    priority:
      Math.max(1, 100 - manhattan(player, it) * 5) +
      (it.type === "weapon" ? 20 : 0)
  }));

  const sorted = quickSort(candidates, x => x.priority);

  targetsEl.innerHTML = sorted.map((it, i) =>
    `<div class="target">
      <span class="rank">${i + 1}</span>
      <div>
        <b>${it.type === "health" ? "ENERGY CELL" : "WEAPON CACHE"}</b>
        <small>${manhattan(player, it)} tiles away</small>
      </div>
      <span class="value">${it.priority}</span>
    </div>`
  ).join("");

  items.forEach(it => {
    it.targeted = sorted.some(t => t.id === it.id);
  });

  render();

  toast("Targets sorted using Quick Sort");
}
function collect(){ 
  const idx=items.findIndex(i=>i.x===player.x&&i.y===player.y); 
  if(idx<0)return; 

  const it=items.splice(idx,1)[0]; 
  collected++;
  score+=it.value; 

  toast(it.type==="health"?"Energy collected +20":"Weapon cache +35"); 

  document.getElementById("score").textContent=score;
  document.getElementById("items").textContent=collected; 

  runQuickSort(); 
}
function movePlayer(dx,dy){
  if(gameOver)return;
  const nx=player.x+dx,ny=player.y+dy;
  if(nx<0||ny<0||nx>=COLS||ny>=ROWS||grid[ny][nx])return;
  player={x:nx,y:ny};collect();
  if(player.x===COLS-1&&player.y===ROWS-1){score+=100;endGame(true);return}
  updateAIMetrics();
}
function aiMove(){
  if(paused||gameOver||countdownActive)return;
  const r=aStar(enemy,player);
  if(r.path.length>1){
    const next=r.path[1];enemy={x:next.x,y:next.y};
    aiStateEl.textContent="PURSUING PLAYER";
  }
  if(enemy.x===player.x&&enemy.y===player.y){endGame(false);return}
  updateAIMetrics();
}
function endGame(win){
  gameOver=true;clearInterval(aiTimer);
  statusEl.textContent=win?"MISSION COMPLETE":"AI CAPTURED YOU";
  aiStateEl.textContent=win?"TARGET REACHED":"TARGET ACQUIRED";
  if(win){score+=100;document.getElementById("score").textContent=score;toast("Safe zone reached! +100 score")}
  else toast("The AI caught you. Start a new match.");
}
function startCountdown(){
  clearInterval(countdownTimer);

  countdownActive=true;
  countdownOverlay.classList.remove("hidden");

  let count=3;

  countdownNumber.textContent=count;
  statusEl.textContent="GET READY";
  aiStateEl.textContent="STANDBY";

  countdownTimer=setInterval(()=>{
    count--;

    if(count>0){
      countdownNumber.textContent=count;

      // Restart animation
      countdownNumber.style.animation="none";
      void countdownNumber.offsetWidth;
      countdownNumber.style.animation="countdownPulse .8s ease";
    }
    else{
      clearInterval(countdownTimer);
      countdownTimer=null;

      countdownNumber.textContent="GO!";

      countdownNumber.style.animation="none";
      void countdownNumber.offsetWidth;
      countdownNumber.style.animation="countdownPulse .8s ease";

      setTimeout(()=>{
        countdownOverlay.classList.add("hidden");
        countdownActive=false;

        statusEl.textContent="SYSTEM ACTIVE";
        aiStateEl.textContent="PURSUING PLAYER";

        startTime=Date.now();

        aiTimer=setInterval(
          aiMove,
          difficultyEl.value==="hard"
            ?420
            :difficultyEl.value==="easy"
            ?900
            :650
        );
      },700);
    }
  },1000);
}
function newGame(){ 
  clearInterval(aiTimer);
  clearInterval(countdownTimer);

  player={x:1,y:9};
  enemy={x:16,y:1};
  score=0;
  collected=0;
  round++;

  if(round>99)round=1;

  gameOver=false;
  paused=false;
  showPath=true;

  document.getElementById("score").textContent=0;
  document.getElementById("items").textContent=0;
  document.getElementById("round").textContent=String(round).padStart(2,"0");

  statusEl.textContent="GET READY";
  aiStateEl.textContent="STANDBY";

  makeGrid();
  spawnItems();
  runQuickSort();
  updateAIMetrics();

  startCountdown();
}
document.addEventListener("keydown",e=>{ 
  const m={
    ArrowUp:[0,-1],
    w:[0,-1],
    W:[0,-1],
    ArrowDown:[0,1],
    s:[0,1],
    S:[0,1],
    ArrowLeft:[-1,0],
    a:[-1,0],
    A:[-1,0],
    ArrowRight:[1,0],
    d:[1,0],
    D:[1,0]
  };

  // SPACEBAR = PAUSE / RESUME
  if(e.code === "Space"){
    e.preventDefault();

    if(countdownActive || gameOver)return;

    paused=!paused;

    document.getElementById("pauseBtn").textContent=
      paused ? "RESUME AI" : "PAUSE AI";

    aiStateEl.textContent=
      paused ? "AI PAUSED" : "PURSUING PLAYER";

    return;
  }

  // MOVEMENT KEYS
  if(m[e.key]){
    e.preventDefault();

    if(countdownActive || paused)return;

    movePlayer(...m[e.key]);
  }
});
document.getElementById("newGame").onclick=newGame;
document.getElementById("pauseBtn").onclick=()=>{paused=!paused;document.getElementById("pauseBtn").textContent=paused?"RESUME AI":"PAUSE AI";aiStateEl.textContent=paused?"AI PAUSED":"PURSUING PLAYER"};
document.getElementById("showPathBtn").onclick=()=>{showPath=!showPath;document.getElementById("showPathBtn").textContent=showPath?"HIDE A* PATH":"SHOW A* PATH";render()};
document.getElementById("scanBtn").onclick=runQuickSort;
difficultyEl.onchange=()=>{newGame();toast(`Difficulty: ${difficultyEl.value.toUpperCase()}`)};
setInterval(()=>{if(!gameOver){const s=Math.floor((Date.now()-startTime)/1000);document.getElementById("time").textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}},500);

newGame();
