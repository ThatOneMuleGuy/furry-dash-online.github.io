function loadFont(scene, fontName, fontData) {
  const texture = scene.textures.get(fontName);
  const image = texture.source[0];
  const imageWidth = image.width;
  const imageHeight = image.height;
  const fontConfig = {
    font: fontName,
    size: 0,
    lineHeight: 0,
    chars: {}
  };
  const kerningPairs = [];
  for (const line of fontData.split("\n")) {
    const lineParts = line.trim().split(/\s+/);
    if (!lineParts.length) continue;
    const lineType = lineParts[0];
    const properties = {};
    for (let i = 1; i < lineParts.length; i++) {
      const equalIndex = lineParts[i].indexOf("=");
      if (equalIndex >= 0) {
        properties[lineParts[i].slice(0, equalIndex)] = lineParts[i].slice(equalIndex + 1).replace(/^"|"$/g, "");
      }
    }
    if (lineType === "info") {
      fontConfig.size = parseInt(properties.size, 10);
    } else if (lineType === "common") {
      fontConfig.lineHeight = parseInt(properties.lineHeight, 10);
    } else if (lineType === "char") {
      const charId = parseInt(properties.id, 10);
      const charX = parseInt(properties.x, 10);
      const charY = parseInt(properties.y, 10);
      const charWidth = parseInt(properties.width, 10);
      const charHeight = parseInt(properties.height, 10);
      const u0 = charX / imageWidth;
      const v0 = charY / imageHeight;
      const u1 = (charX + charWidth) / imageWidth;
      const v1 = (charY + charHeight) / imageHeight;
      fontConfig.chars[charId] = {
        x: charX, y: charY, width: charWidth, height: charHeight,
        centerX: Math.floor(charWidth / 2), centerY: Math.floor(charHeight / 2),
        xOffset: parseInt(properties.xoffset, 10),
        yOffset: parseInt(properties.yoffset, 10),
        xAdvance: parseInt(properties.xadvance, 10),
        data: {}, kerning: {},
        u0, v0, u1, v1
      };
      if (charWidth !== 0 && charHeight !== 0) {
        const charCode = String.fromCharCode(charId);
        const frame = texture.add(charCode, 0, charX, charY, charWidth, charHeight);
        if (frame) frame.setUVs(charWidth, charHeight, u0, v0, u1, v1);
      }
    } else if (lineType === "kerning") {
      kerningPairs.push({
        first: parseInt(properties.first, 10),
        second: parseInt(properties.second, 10),
        amount: parseInt(properties.amount, 10)
      });
    }
  }
  for (const kerningPair of kerningPairs) {
    if (fontConfig.chars[kerningPair.second]) {
      fontConfig.chars[kerningPair.second].kerning[kerningPair.first] = kerningPair.amount;
    }
  }
  scene.cache.bitmapFont.add(fontName, { data: fontConfig, texture: fontName, frame: null });
}

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    if (window.gameCache) window.gameCache.init();
    (function (game) {
      if (game.renderer.type === Phaser.WEBGL) {
        try {
          let gl = game.renderer.gl;
          if (gl && gl.isContextLost()) {
            console.warn('WebGL context lost now using blend modes');
            window.S = Phaser.BlendModes.ADD;
            window.E = Phaser.BlendModes.MULTIPLY;
          } else {
            window.S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
            window.E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
          }
        } catch (e) {
          window.S = Phaser.BlendModes.ADD;
          window.E = Phaser.BlendModes.MULTIPLY;
        }
      } else {
        console.log('using Canvas renderer setting blend modes');
        window.S = Phaser.BlendModes.ADD;
        window.E = Phaser.BlendModes.MULTIPLY;
      }
      if (game.canvas) {
        game.canvas.addEventListener('webglcontextlost', (e) => {
          console.warn('WebGL context lost');
          e.preventDefault();
          window.S = Phaser.BlendModes.ADD;
          window.E = Phaser.BlendModes.MULTIPLY;
        });
        
        game.canvas.addEventListener('webglcontextrestored', (e) => {
          console.log('WebGL context is back');
          if (game.renderer.type === Phaser.WEBGL && game.renderer.gl) {
            try {
              let gl = game.renderer.gl;
              window.S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
              window.E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
            } catch (e) {
              console.warn('failed to bring back WebGL blend modes:', e);
              window.S = Phaser.BlendModes.ADD;
              window.E = Phaser.BlendModes.MULTIPLY;
            }
          }
        });
      }
    })(this.game);

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;
    const cy = H / 2;

    const LOADING_MESSAGES = [
      "Now with roundy bath salts!",
      "Encrypted for ransom and profit",
      "Furrzempic!",
      "Two birds shat on a tree",
      "man i love this table",
      "assmeow",
      "yorshex has a sexy ass",
      "ayyyy it's rainin",
      "fops",
      "no it's becky",
      "fix our door",
      "oh ok",
      "Don't enter the basement...",
      "FURRIES FURRIES FURRIES ALL AROUND",
      "Furry fandom uwu",
      "KD's furry slippers!!",
      "Smash Hit Attack Elderly People",
      "Smash Hit Dying Of Cold",
      "Smash Hit Flatbread is a brand",
      "I'm gonna SHO(v) you into a locker",
      "It's the one and only Furry Device SMP!",
      "Father drove me to this house",
      "please don't atamtack me",
      "Ballshit community",
      "The Cathedral (Rock Remix)",
      "FUCKING THE MOUNTAIN",
      "colon thre",
      "Now with potato mash!",
      "GO TO SLEEPY",
      "there is a nerd in my flip flop",
      "WordPress data size limit reached",
      "You should put your balls in a bowl of milk",
      "Smash Hit music is invaluable",
      "knSetSteak(40)",
      "man i always wanted to bake an oven",
      "om hoing hoe",
      "see this is why im leaving after shfb",
      "so are you gay, bi, pan, trans, lesbian, non-binary, or something else?",
      "walmat",
      "your idiot trash",
      "bees in my eyes, bees in my ears, bees in my blood, bees in my tears",
      "Hello KD. It turns out that you are Satan",
      "how funny would it be to dislocate your shoulder",
      "Link pls i am your big fan pls don not say not",
      "Everyone repot Smash Hit Lab never reaslt smash hit frostbite",
      "idk isincmmmmm",
      "i think ill eat yorshex",
      "tis so funny im gonna die thursday evening",
      "hello i'm hernik Johansson the creator of smash hit",
      "professional furry that one mule guy has beat me",
      "SHUT THE F*** OUT",
      "alex is so mad he pisses on the moon",
      "1 furry gets shot down and 4 others rise up",
      "You can never stop furries they will be around for ever!",
      "FOps mashcine",
      "ive come to overthrow you",
      "super ham lab",
      "Hey kokiczdrzewny,",
      "knot you pickle",
      "Shatter Client is knot's excuse to infect your phone with viruses",
      "fophone on TOP",
      "<Simplicks> are you a top or a bottom?",
      "Is ts considered niche?",
      "smash hit vagina edition",
      "furry furry furry is so fluffy in this smash hit world",
      "FURRIES ARE SUPERIOR AND HUMANITY IS INFERIOR",
      "PRAISE FURRIES!!!! PRAISE TAILS!!!!!!!!!!",
      "i locked him in my basement because he wouldn't worship tails",
      "guys, fuck",
      "it doesnt load obstacles",
      "i am level 940",
      "i enjoy destroying you",
      "acting freaky in KD dms",
      "guysWeHaventChangedOneButt",
      "i have like three fathers",
      ":sails_neh:",
      "pan evasion",
      "Music by Douglas Holmquist!",
      "get pogcilled",
      "NO MORE COW QUITTING",
      "school is misable",
      "Mule got boiled,",
      "7 curries vs 1 femboy",
      "gaslight, gatekeep, girlboss",
      "i require tasting a furry",
      "BEHOLD THE YORSHBALL",
      "mule's men privilages will be taken away",
      "sindwach",
      "h",
      "knot milk is very yip",
      "Simplicks was run over by Mexico II",
      "Hello KD. I apologize for calling you Satan.",
      "THE MAGIC NUMBER IS 93.625",
      "It's a bit concerning how good we are at making crap",
      "mule what the fuck are you doing",
      "i didnt put in the end at the end",
      "my dad locked my apps to avoid Satan",
      "Now way...is that LNQIsBack?",
      "SHFLTBRD",
      "LET ME PERISH HAHAHA WAIT",
      "hello dev team. we will now capitalize on this world",
      "okay testing estrogen",
      "shatter client is like an hp printer",
      "virtual and splendid payramids",
      "Joshua Skibidi Toilet",
      "OH GOD NOT THE PENGUINS",
      "you look like mule if he was gay",
      "u was fuvegbmmk gfehbntabyl",
      "katie rotatie",
      "we are all familiar with the concept of a pentagon im afraid",
      "This Time For every, Furry Lab..",
      "they call you're server smash hit lab because you wanna research coronavirus",
      "pebble",
      "YIP YIP YIP it is Geometry ZIP, foxthing dish",
      "get out of my code!! >:3",
      "Death and Destruction",
      "Life and Construction",
      "Death and Deforestation",
      "Obfuscation and Obstruction",
      "Sex and Seduction",
      "get berserked",
      "I'm here to talk to you about your car's extended warranty",
      "take over the world with the foxy features",
      "cock and balls edition",
      "smash hit chickpea flour edition",
      "smash hit facebook",
      "smash hit focaccia bread",
      "smash hit boykisser dating simulator",
      "it is court",
      "mule gets L roomed",
      "asdfghjkl",
      "thabkyiu",
      "dea hello yorshex",
      "im uber cool",
      "els.kd",
      "time to encrypt alex into a .kd file",
      "oh oghs",
      "i will decapitate you",
      "should im gonna work on seyfert room 3 now",
      "mule will lose 8 points due to detected cheating",
      "fipsh",
      ":3",
      "yippers",
      "Man. I love this table",
      "shatr tiem",
      "meow",
      "A wild YORSHEX has appeared!",
      "+15 Cubes",
      "its time to revolutionize this world by summoning an incomprehensibly gigantic planet which texture is the tails heh almighty",
      "if cmd == 'asstime' then timeLeft = timeLeft + 10 end",
      "stealy steay"
    ];
    const sliderOriginX = cx - 105;
    const sliderOriginY = cy + 110;
    let sliderFill = null

    this.load.image("game_bg_01", "assets/game-bg/game_bg_01_001-hd.png");
    this.load.image("sliderBar", "assets/sprites/sliderBar.png");
    this.load.atlas("GJ_WebSheet", "assets/sheets/GJ_WebSheet.png", "assets/sheets/GJ_WebSheet.json");
    this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.png", "assets/sheets/GJ_LaunchSheet.json");
    this.load.image("goldFont", "assets/fonts/goldFont.png");
    this.load.text("goldFontFnt", "assets/fonts/goldFont.fnt");
    
    this.load.once("complete", () => {
      const tex = this.textures.get("game_bg_01");
      const s = Math.max(W / tex.source[0].width, H / tex.source[0].height);
      const bg = this.add.image(cx, cy, "game_bg_01").setScale(s).setTint(0x0066ff);
      this.children.sendToBack(bg);
      sliderFill = this.add.tileSprite(sliderOriginX - 100, sliderOriginY - 2, 0, 14, "sliderBar");
      sliderFill.setOrigin(0, 0.5);
      this.add.image(sliderOriginX + 105, sliderOriginY, "GJ_WebSheet", "slidergroove.png").setOrigin(0.5, 0.5);
      const goldFontData = this.cache.text.get("goldFontFnt");
      if (goldFontData && !this.cache.bitmapFont.has("goldFont")) {
        loadFont(this, "goldFont", goldFontData);
      }
      const msg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      this.add.bitmapText(cx, cy + 187, "goldFont", msg, 30).setOrigin(0.5);
      const robtopLogo = this.add.image(cx, cy - 120, "GJ_LaunchSheet", "RobTopLogoBig_001.png").setOrigin(0.5).setScale(0.8);
      const gjLogo = this.add.image(cx, cy, "GJ_WebSheet", "gj_logo.png").setOrigin(0.5);
      this.children.bringToTop(robtopLogo);
      this.children.bringToTop(gjLogo);
      if (window.gameCache) {
        const originalXhr = this.load.xhrLoader;
        this.load.xhrLoader = (file) => {
          const url = file.url;
          if (window.gameCache.isFileCached(url)) {
            const cached = window.gameCache.getCachedFile(url);
            if (cached) {
              return new Promise((resolve) => {
                setTimeout(() => { file.data = cached; resolve(file); }, 1);
              });
            }
          }
          return originalXhr.call(this.load, file).then((result) => {
            if (result && result.data) window.gameCache.cacheFile(url, result.data);
            return result;
          });
        };
      }

      this.load.atlas("GJ_GameSheet", "assets/sheets/GJ_GameSheet.png", "assets/sheets/GJ_GameSheet.json");
      this.load.atlas("GJ_GameSheet02", "assets/sheets/GJ_GameSheet02.png", "assets/sheets/GJ_GameSheet02.json");
      this.load.atlas("GJ_GameSheet03", "assets/sheets/GJ_GameSheet03.png", "assets/sheets/GJ_GameSheet03.json");
      this.load.atlas("GJ_GameSheet04", "assets/sheets/GJ_GameSheet04.png", "assets/sheets/GJ_GameSheet04.json");
      this.load.atlas("GJ_GameSheetEditor", "assets/sheets/GJ_GameSheetEditor.png", "assets/sheets/GJ_GameSheetEditor.json");
      this.load.atlas("GJ_GameSheetGlow", "assets/sheets/GJ_GameSheetGlow.png", "assets/sheets/GJ_GameSheetGlow.json");
      this.load.atlas("GJ_GameSheetIcons", "assets/sheets/GJ_GameSheetIcons.png", "assets/sheets/GJ_GameSheetIcons.json");
      this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.png", "assets/sheets/GJ_LaunchSheet.json");
      this.load.atlas("player_ball_00", "assets/sheets/player_ball_00.png", "assets/sheets/player_ball_00.json");
      this.load.atlas("player_dart_00", "assets/sheets/player_dart_00.png", "assets/sheets/player_dart_00.json");
      this.load.image("bigFont", "assets/fonts/bigFont.png");
      this.load.text("bigFontFnt", "assets/fonts/bigFont.fnt");
      this.load.image("square04_001", "assets/sprites/square04_001.png");
      this.load.image("GJ_square02", "assets/sprites/GJ_square02.png");
      this.load.image("GJ_square01", "assets/sprites/GJ_square01.png");
      this.load.image("square01_001", "assets/sprites/square01_001.png");
      this.load.image("loadingCircle", "assets/sprites/loadingCircle.png");
      this.load.image("GJ_button01", "assets/sprites/GJ_button_01.png");
      this.load.image("GJ_button02", "assets/sprites/GJ_button_02.png");

      for (let i = 1; i < 23; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        let paddedIndex = String(index);
        if (paddedIndex.length < 2) paddedIndex = "0" + paddedIndex;
        this.load.image("groundSquare_" + paddedIndex + "_001.png", "assets/game-ground/groundSquare_" + i + "_001.png");
      }

      for (let i = 1; i < 60; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        this.load.image("game_bg_" + index, "assets/game-bg/game_bg_" + i + "_001-hd.png");
      }

      this.load.audio("menu_music", "assets/music/menuLoop.mp3");
      this.load.audio("StayInsideMe", "assets/music/StayInsideMe.mp3");

      for (const lvlarray of window.allLevels) {
        this.load.text(lvlarray[2], "assets/levels/" + lvlarray[2].split("_")[1] + ".txt");
        this.load.audio(lvlarray[0], "assets/music/" + (lvlarray[4] ? lvlarray[4] : lvlarray[1].replaceAll(" ", "")) + ".mp3");
      }

      this.load.audio("explode_11", "assets/sfx/explode_11.ogg");
      this.load.audio("endStart_02", "assets/sfx/endStart_02.ogg");
      this.load.audio("playSound_01", "assets/sfx/playSound_01.ogg");
      this.load.audio("quitSound_01", "assets/sfx/quitSound_01.ogg");
      this.load.audio("highscoreGet02", "assets/sfx/highscoreGet02.ogg");

      this.load.on("progress", (value) => {
        if (sliderFill) sliderFill.width = value * 380;
      });
      this.load.on("loaderror", () => {});
      this.load.once("complete", () => {
        if (sliderFill) sliderFill.width = 380;
        this.time.delayedCall(200, () => {
          const bigFontData = this.cache.text.get("bigFontFnt");
          if (bigFontData) loadFont(this, "bigFont", bigFontData);
          const gfd = this.cache.text.get("goldFontFnt");
          if (gfd && !this.cache.bitmapFont.has("goldFont")) loadFont(this, "goldFont", gfd);
          if (window.gameCache) console.log('stats:', window.gameCache.getCacheStats());
          localStorage.setItem('webdash_assets_loaded', 'true');
          localStorage.setItem('webdash_last_load_time', Date.now().toString());
          this.scene.start("GameScene");
        });
      });

      this.load.start();
    });
  }
  create() {
  }
}
