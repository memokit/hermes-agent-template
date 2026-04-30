// OfficeScene.js - Scene config สำหรับ Phaser (ใช้งานกับ CDN)
// ไม่ต้อง import Phaser เพราะโหลดจาก CDN แล้ว

export const OfficeScene = {
  preload: function() {
    // โหลด Pixel Art Sprites
    this.load.image('player', '/sprites/player.png');
    this.load.image('npc_red', '/sprites/npc_red.png');
    this.load.image('npc_green', '/sprites/npc_green.png');
    this.load.image('npc_yellow', '/sprites/npc_yellow.png');
    this.load.image('npc_purple', '/sprites/npc_purple.png');
    this.load.image('npc_cyan', '/sprites/npc_cyan.png');
    this.load.image('desk', '/sprites/desk.png');
    this.load.image('chair', '/sprites/chair.png');
    this.load.image('floor', '/sprites/floor.png');
  },

  create: function() {
    const scene = this;

    // สร้าง Tilemap พื้น office
    scene.createTilemap();

    // สร้างเฟอร์นิเจอร์
    scene.createFurniture();

    // โหลด Personalities และสร้าง NPC
    scene.loadPersonalitiesAndCreateNPCs();

    // สร้าง Player
    scene.createPlayer();

    // Camera settings
    scene.cameras.main.startFollow(scene.player);
    scene.cameras.main.setBounds(0, 0, 2000, 2000);
    scene.cameras.main.setZoom(2);

    // Keyboard input
    scene.setupInput();

    // Interaction text
    scene.interactionText = scene.add.text(0, 0, 'Press E to interact', {
      fontSize: '12px',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 }
    });
    scene.interactionText.setOrigin(0.5);
    scene.interactionText.setVisible(false);
    scene.interactionText.setDepth(1000);

    // ตัวแปรสำหรับเก็บ NPC
    scene.npcs = [];
    scene.nearbyNPC = null;
  },

  createTilemap: function() {
    const scene = this;
    const tileSize = 32;
    for (let x = 0; x < 2000; x += tileSize) {
      for (let y = 0; y < 2000; y += tileSize) {
        scene.add.image(x + tileSize/2, y + tileSize/2, 'floor').setDisplaySize(tileSize, tileSize);
      }
    }
  },

  createFurniture: function() {
    const scene = this;
    const deskPositions = [
      { x: 200, y: 150 },
      { x: 500, y: 300 },
      { x: 800, y: 150 },
      { x: 1100, y: 300 },
      { x: 1400, y: 150 },
    ];

    deskPositions.forEach(pos => {
      scene.add.image(pos.x + 64, pos.y + 32, 'desk').setDisplaySize(128, 64);
      scene.add.image(pos.x + 64, pos.y + 80, 'chair').setDisplaySize(32, 32);
    });
  },

  loadPersonalitiesAndCreateNPCs: function() {
    const scene = this;
    fetch('/api/personalities')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.personalities && data.personalities.length > 0) {
          scene.createNPCs(data.personalities);
        } else {
          console.warn('No personalities found, creating default NPCs');
          scene.createDefaultNPCs();
        }
      })
      .catch(error => {
        console.error('Error loading personalities:', error);
        scene.createDefaultNPCs();
      });
  },

  createNPCs: function(personalities) {
    const scene = this;
    const npcSprites = ['npc_red', 'npc_green', 'npc_yellow', 'npc_purple', 'npc_cyan'];
    const deskPositions = [
      { x: 200, y: 150 },
      { x: 500, y: 300 },
      { x: 800, y: 150 },
      { x: 1100, y: 300 },
      { x: 1400, y: 150 },
    ];

    personalities.forEach((personality, index) => {
      if (index >= deskPositions.length) return;

      const pos = deskPositions[index];
      const spriteKey = npcSprites[index % npcSprites.length];

      const npc = scene.add.sprite(pos.x + 64, pos.y - 20, spriteKey);
      npc.setDisplaySize(32, 32);
      npc.setInteractive();

      npc.personalityData = {
        name: personality.name || `NPC ${index + 1}`,
        description: personality.description || 'Hermes Personality',
        index: index
      };

      const nameTag = scene.add.text(npc.x, npc.y - 24, npc.personalityData.name, {
        fontSize: '8px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 3, y: 1 }
      });
      nameTag.setOrigin(0.5);
      nameTag.setDepth(1000);

      npc.nameTag = nameTag;
      npc.interactionZone = new Phaser.Geom.Circle(npc.x, npc.y, 50);

      scene.npcs.push(npc);
    });
  },

  createDefaultNPCs: function() {
    const scene = this;
    const defaultNPCs = [
      { name: 'ลูฟี่ (Luffy)', sprite: 'npc_cyan' },
      { name: 'อาจารย์ (Teacher)', sprite: 'npc_green' },
      { name: 'นักวิเคราะห์ (Analyst)', sprite: 'npc_yellow' },
    ];

    const deskPositions = [
      { x: 200, y: 150 },
      { x: 500, y: 300 },
      { x: 800, y: 150 },
    ];

    defaultNPCs.forEach((npcData, index) => {
      const pos = deskPositions[index];
      const npc = scene.add.sprite(pos.x + 64, pos.y - 20, npcData.sprite);
      npc.setDisplaySize(32, 32);
      npc.setInteractive();

      npc.personalityData = {
        name: npcData.name,
        description: 'Default NPC',
        index: index
      };

      const nameTag = scene.add.text(npc.x, npc.y - 24, npcData.name, {
        fontSize: '8px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 3, y: 1 }
      });
      nameTag.setOrigin(0.5);
      nameTag.setDepth(1000);

      npc.nameTag = nameTag;
      npc.interactionZone = new Phaser.Geom.Circle(npc.x, npc.y, 50);

      scene.npcs.push(npc);
    });
  },

  createPlayer: function() {
    const scene = this;
    scene.player = scene.add.sprite(100, 100, 'player');
    scene.player.setDisplaySize(32, 32);
    scene.physics.add.existing(scene.player);

    const playerBody = scene.player.body;
    playerBody.setCollideWorldBounds(true);
    playerBody.setBounce(0);
    playerBody.setDrag(300);
    playerBody.setMaxVelocity(200);
  },

  setupInput: function() {
    const scene = this;
    if (scene.input.keyboard) {
      scene.cursors = scene.input.keyboard.createCursorKeys();
      scene.wasd = {
        up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      };
    }
  },

  update: function() {
    const scene = this;
    if (!scene.player || !scene.player.body) return;

    const body = scene.player.body;
    const speed = 150;

    body.setVelocity(0);

    if (scene.cursors.left.isDown || scene.wasd.left.isDown) body.setVelocityX(-speed);
    if (scene.cursors.right.isDown || scene.wasd.right.isDown) body.setVelocityX(speed);
    if (scene.cursors.up.isDown || scene.wasd.up.isDown) body.setVelocityY(-speed);
    if (scene.cursors.down.isDown || scene.wasd.down.isDown) body.setVelocityY(speed);

    scene.checkNPCInteraction();

    scene.npcs.forEach(npc => {
      if (npc.nameTag) {
        npc.nameTag.setPosition(npc.x, npc.y - 24);
      }
    });
  },

  checkNPCInteraction: function() {
    const scene = this;
    scene.nearbyNPC = null;
    let minDistance = Infinity;

    scene.npcs.forEach(npc => {
      if (!npc.interactionZone) return;

      const distance = Phaser.Math.Distance.Between(
        scene.player.x, scene.player.y,
        npc.x, npc.y
      );

      if (distance < 60 && distance < minDistance) {
        minDistance = distance;
        scene.nearbyNPC = npc;
      }
    });

    if (scene.nearbyNPC) {
      scene.interactionText.setText(`Press E to talk to ${scene.nearbyNPC.personalityData.name}`);
      scene.interactionText.setPosition(scene.player.x, scene.player.y - 40);
      scene.interactionText.setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(scene.wasd.interact)) {
        scene.interactWithNPC(scene.nearbyNPC);
      }
    } else {
      scene.interactionText.setVisible(false);
    }
  },

  interactWithNPC: function(npc) {
    console.log('Interacting with:', npc.personalityData.name);
    if (typeof window !== 'undefined') {
      alert(`คุยกับ ${npc.personalityData.name}\n\n(ระบบ Chat จะเพิ่มใน Phase 3)`);
    }
  }
};
