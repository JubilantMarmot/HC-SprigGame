/*
@title: BlockPusher
@author: 
@tags: []
@addedOn: 2024-00-00
*/
let sprites = {
  player: {key: "p", sprite: ''},
  background: {key: "x", sprite: bitmap`
  ................
  .0..............
  .............0..
  ................
  ................
  ................
  ....0...........
  ................
  ................
  ........0.......
  ................
  ................
  ...............0
  ..0.......0.....
  ................
  ................`},
  wall: {key: "w", sprite: bitmap`
  0000000000000000
  0CCCCCCCCCCCCCC0
  0CC0CCCCCCCC0CC0
  0C0CCCCCCCCCC0C0
  0CCCCCCCCCCCCCC0
  0CCCCC0CC0CCCCC0
  0CCCC0CCCC0CCCC0
  0CCCCCCCCCCCCCC0
  0CCCCCCCCCCCCCC0
  0CCCC0CCCC0CCCC0
  0CCCCC0CC0CCCCC0
  0CCCCCCCCCCCCCC0
  0C0CCCCCCCCCC0C0
  0CC0CCCCCCCC0CC0
  0CCCCCCCCCCCCCC0
  0000000000000000`},
  block: {key: "b", sprite: bitmap`
  ................
  ................
  ................
  ................
  ................
  ................
  ......00000.....
  ......06660.....
  ......00400.....
  ......06660.....
  ......00000.....
  ................
  ................
  ................
  ................
  ................`},
  goal: {key: "g", sprite: bitmap`
................
................
..0000000000....
..0.0.0.0.00....
..00.0.0.0.0....
..0.0.0.0.00....
..00.0.0.0.0....
..0000000000....
..0.............
..0.............
..0.............
..0.............
..0.............
..0.............
.33333333333333.
..555555555555..`}
}

const computeLegend = () => Object.entries(sprites)
  .map(sprite => {
    const spriteInfo = sprite[1]
    return [spriteInfo.key, spriteInfo.sprite]
  })

const legendExcludingPlayer = computeLegend()
  .filter(sprite => sprite[1] !== sprites.player.sprite)

const playerBitmaps = {
  Bob: {sprite: bitmap`
..CC..C..CCC....
..CCCCCCCCCCC...
..CC000CC000C...
..CC0...C.C0CC..
....0.0..0.0....
....0......0....
....00055000....
.......55.......
....75555557....
......5555......
......5..5......
......5..5......
......7..7......
................
................
................`, key: "i"},
  Alice: {sprite: bitmap`
..CC..C..CCC....
..CCCCCCCCCCC...
..CC000CC000C...
..CC0...C.C0CC..
.CCC0.0..0.0....
CCCC0......0....
.CCC00044000....
.CCC...44.......
CC..D444444D....
CCC...4444......
CCC...4..4......
.CCC..4..4......
...C..D..D......
................
................
................`, key: "j"}
}

let currentLevel = 0
const nextLevel = () => {
  if (levels[currentLevel + 1]) {
    currentLevel += 1
    setLevel(currentLevel)
  } else {
    setMap(map`
wwwww
w...w
wwwww
wwwww
wwwww`)
    addText("You Win!", { x: 6, y: 4, color: color`3` });
  }
}

const levels = [
  map`
wwwww
wgwww
w.www
w.www
w...w
wb..w
w...w
w.p.w
w...w
wwwww`
]

const setGameLegend = selectedPlayer => {
  sprites.player.sprite = selectedPlayer.sprite
  setLegend(...computeLegend())
  
  setSolids([sprites.player.key, sprites.wall.key, sprites.block.key])
  setPushables({
    [sprites.player.key]: [sprites.player.key, sprites.block.key]
  })

  setMap(levels[0])
}

const chooseCharacter = () => {
  setLegend(...legendExcludingPlayer)
  
  setMap(map`
xxxxxxxxxx
x........x
x........x
x........x
xxxxxxxxxx`)
  addText("Choose character", {
    x: 2,
    y: 6,
    color: color`0`,
  })

  let characterChosen = false

  Object.keys(playerBitmaps).forEach((plrName, index) => {
    const x = (index + 1) * 5
    const plr = playerBitmaps[plrName]

    addText(plrName, {
      x,
      y: 8
    })

    addText(`(${plr.key})`, {
      x,
      y: 10,
      color: color`3`
    })

    onInput(plr.key, () => {
      if (characterChosen) {
        return
      }

      characterChosen = true
      clearText()
      setGameLegend(plr)
    })
  })
}

const getPlayerSprite = () => getFirst(sprites.player.key)

chooseCharacter()

onInput("w", () => {
  const playerSprite = getPlayerSprite()
  if (playerSprite.y > 0) {
    playerSprite.y -= 1
  }
});
onInput("s", () => {
  const playerSprite = getPlayerSprite()
  if (playerSprite.y < height() - 1) {
    playerSprite.y += 1
  }
});
onInput("a", () => {
  const playerSprite = getPlayerSprite()
  if (playerSprite.x > 0) {
    playerSprite.x -= 1
  }
});
onInput("d", () => {
  const playerSprite = getPlayerSprite()
  if (playerSprite.x < width() - 1) {
    playerSprite.x += 1
  }
});

afterInput(() => {
  const block = getFirst(sprites.block.key)
  const goal = getFirst(sprites.goal.key)

  if (block.x === goal.x && block.y === goal.y) {
    nextLevel()
  }
});