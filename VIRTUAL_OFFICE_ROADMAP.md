# Virtual Office Roadmap
## เปลี่ยนจาก "Prototype" → "Gather.town Style Virtual Office"

> **สถานะปัจจุบัน:** มี Phaser.js prototype แล้ว แต่เป็นแค่สี่เหลี่ยมวาดด้วย graphics ยังไม่ใช่ Pixel Art และไม่มีระบบ NPC/Chat/Multiplayer

---

## 📊 Current State (สถานะตอนนี้)

- ✅ มี Admin Dashboard (Railway) สำหรับตั้งค่า Hermes Agent
- ✅ มี API `/api/personalities` อ่านค่าจาก `config.yaml`
- ✅ มี Phaser.js prototype ใน `virtual-office/` (แต่เป็นแค่สี่เหลี่ยมวาดด้วย graphics)
- ❌ **ไม่มี Pixel Art sprites** (ใช้สี่เหลี่ยมแทน)
- ❌ **ไม่มี NPC/Personalities** ในแผนที่
- ❌ **ไม่มีระบบ Interaction** (กดคุยกับ NPC → เรียก Hermes API)
- ❌ **ไม่มี Multiplayer** (คนอื่นเข้ามาในห้องไม่ได้)

---

## 🎯 Roadmap (เรียงตามลำดับความสำคัญ)

### Phase 1: Pixel Art Foundation 🎨
**เป้าหมาย:** แทนที่สี่เหลี่ยมด้วย Pixel Art จริง

#### 1.1 สร้าง/หา Pixel Art Assets
- [ ] ตัวละคร (Player + NPC) - 16x16 หรือ 32x32 pixels
- [ ] โต๊ะทำงาน, เก้าอี้, ตู้เอกสาร, ผนัง, พื้น
- [ ] ประตู, หน้าต่าง, ตกแต่งออฟฟิศ
- [ ] **แหล่งข้อมูล:** [OpenGameArt](https://opengameart.org/) หรือวาดด้วย [Piskel](https://www.piskelapp.com/)

#### 1.2 เปลี่ยนจาก Graphics → Sprites
- [ ] แก้ไข `OfficeScene.js` ให้โหลด sprites แทนการวาดสี่เหลี่ยม
- [ ] สร้าง Tilemap (แผนที่ที่ซับซ้อนกว่าเดิม)
- [ ] ปรับปรุง `GameCanvas.tsx` ให้รองรับ sprite loading

---

### Phase 2: NPC System (Hermes Personalities) 🤖
**เป้าหมาย:** ใส่ Hermes Personalities ลงในแผนที่

#### 2.1 สร้าง NPC ในแผนที่
- [ ] แต่ละ `personality` ใน `config.yaml` = 1 NPC ในแผนที่
- [ ] ใส่ชื่อตัวละครไว้บนหัว (nametag)
- [ ] แต่ละตัวอยู่จุดไหนสักโต๊ะทำงาน
- [ ] กำหนดท่าทาง/animation ของ NPC (ยืน, นั่ง, เดิน)

#### 2.2 ระบบเขตโต้ตอบ (Interaction Zone)
- [ ] สร้าง detection zone รอบๆ NPC
- [ ] เมื่อ Player เข้าใกล้ → แสดงปุ่ม `E` เพื่อคุย
- [ ] Highlight NPC ที่สามารถคุยได้

---

### Phase 3: Chat Integration 💬
**เป้าหมาย:** กด E คุยกับ NPC → เด้ง Chat Box → ส่งข้อความไป Hermes API

#### 3.1 สร้าง Chat UI
- [ ] ออกแบบ chat box แบบ pixel art
- [ ] Input field สำหรับพิมพ์ข้อความ
- [ ] แสดงประวัติการสนทนา
- [ ] ปุ่มปิด/เปิด chat

#### 3.2 เชื่อมต่อ Hermes Personalities API
- [ ] Frontend เรียก `/api/personalities/:name/chat`
- [ ] Backend (`personalities_api.py`) รับข้อความ → ส่งไป Hermes Agent
- [ ] กลับมาแสดงใน chat box
- [ ] จัดการ loading state และ error handling

---

### Phase 4: Multiplayer 👥
**เป้าหมาย:** หลายคนเข้ามาในออฟฟิศพร้อมกัน (สำคัญสำหรับ Virtual Office จริง)

#### 4.1 WebSocket Server
- [ ] ใช้ Socket.io หรือ Native WebSocket
- [ ] sync ตำแหน่ง player ทั้งหมดแบบ real-time
- [ ] จัดการการเชื่อมต่อ/ตัดการเชื่อมต่อ

#### 4.2 ผู้เล่นคนอื่นปรากฏเป็น Sprite
- [ ] เห็นคนอื่นเดินไปมา
- [ ] แสดง nametag ของแต่ละคน
- [ ] Animation ตามการเคลื่อนไหว (เดิน, หยุด, คุย)

---

### Phase 5: Office Map Design 🏢
**เป้าหมาย:** สร้างออฟฟิศที่มีหลายห้อง โซนต่างๆ

#### 5.1 ออกแบบแผนที่
- [ ] ห้องรับแขก (Lobby) - มี welcome NPC
- [ ] ห้องทำงานหลัก (Main Office) - มีโต๊ะแต่ละ Personality
- [ ] ห้องประชุม (Meeting Room)
- [ ] ห้องน้ำ (ฮาๆ)
- [ ] โซนสันทนาการ (Coffee Corner)

#### 5.2 ใช้ Tiled Map Editor
- [ ] สร้างแผนที่ด้วย [Tiled](https://www.mapeditor.org/)
- [ ] Export เป็น JSON → โหลดเข้า Phaser
- [ ] กำหนด collision zones (ไม่ให้เดินทะลุผนัง/เฟอร์นิเจอร์)

---

### Phase 6: Deploy & Integration 🚀
**เป้าหมาย:** เอาไปไว้ Railway หรือ Docker

#### 6.1 Build Next.js + Phaser
- [ ] Build ให้เป็น static files (`next build && next export`)
- [ ] ให้ `server.py` serve ไฟล์เหล่านั้น
- [ ] ปรับปรุง `route_office()` ใน `personalities_api.py`

#### 6.2 API Proxy & Security
- [ ] Virtual Office เรียก Hermes Agent ที่รันอยู่จริง
- [ ] ผ่าน subprocess หรือ HTTP API
- [ ] เพิ่ม authentication สำหรับ WebSocket connections

---

## 📊 Priority Matrix (ความสำคัญ vs ความยาก)

| งาน | ความสำคัญ | ระดับความยาก | เวลา (ประมาณ) | สถานะ |
|-----|-----------|--------------|---------------|--------|
| 1. Pixel Art Sprites | ⭐⭐⭐⭐⭐ | ง่าย-ปานกลาง | 2-4 ชม. | 🔴 ยังไม่ได้ทำ |
| 2. NPC System | ⭐⭐⭐⭐⭐ | ปานกลาง | 3-5 ชม. | 🔴 ยังไม่ได้ทำ |
| 3. Chat Integration | ⭐⭐⭐⭐ | ยาก | 5-8 ชม. | 🔴 ยังไม่ได้ทำ |
| 4. Multiplayer | ⭐⭐⭐ | ยากมาก | 1-2 วัน | 🔴 ยังไม่ได้ทำ |
| 5. Map Design | ⭐⭐⭐ | ปานกลาง | 3-5 ชม. | 🔴 ยังไม่ได้ทำ |
| 6. Deploy | ⭐⭐ | ง่าย | 1-2 ชม. | 🟡 ทำบางส่วนแล้ว |

---

## 💡 ข้อเสนอแนะจากลูฟี่ (Senior Dev Tips)

### ถ้าอยากเห็นผลเร็ว (MVP - Minimum Viable Product):
1. เริ่มที่ **Phase 1 + 2** (ใส่ Pixel Art + NPC)
2. ให้คลิกที่ NPC → เด้ง Popup แสดงข้อมูล Personality (อ่านจาก `/api/personalities`)
3. ยังไม่ต้องทำ Chat (ทำเป็นแค่แสดงโปรไฟล์ก่อน)
4. **เวลาที่ใช้:** 1-2 วัน

### ถ้าอยากทำแบบ Gather.town จริงๆ:
- ต้องทำ **Phase 1-4** (Pixel Art + NPC + Chat + Multiplayer)
- ใช้เวลาประมาณ 1-2 สัปดาห์ (ถ้าทำคนเดียว)
- แนะนำให้ใช้ **Colyseus** หรือ **Geckos.io** สำหรับ multiplayer (ง่ายกว่าทำ raw WebSocket)

### Tech Stack ที่แนะนำ:
- **Game Engine:** Phaser.js 3.x (ใช้อยู่แล้ว)
- **Multiplayer:** Colyseus (JavaScript) หรือ Socket.io
- **Map Editor:** Tiled (มาตรฐานอุตสาหกรรม)
- **Pixel Art:** Piskel (web-based, ฟรี) หรือ Aseprite (ซื้อ)
- **Backend:** FastAPI หรือ Express.js (เพิ่มเติมจาก server.py)

---

## 📝 หมายเหตุสำหรับทีมพัฒนา

### ไฟล์ที่เกี่ยวข้อง:
- `/data/hermes-agent-template/virtual-office/src/components/GameCanvas.tsx` - จุดเริ่มต้น React component
- `/data/hermes-agent-template/virtual-office/src/game/OfficeScene.js` - Phaser Scene หลัก
- `/data/hermes-agent-template/personalities_api.py` - API endpoint สำหรับ personalities
- `/data/hermes-agent-template/server.py` - Main server (Starlette)

### การรันทดสอบ本地:
```bash
cd /data/hermes-agent-template/virtual-office
npm install
npm run dev
# เปิด browser ที่ http://localhost:3000/office
```

### การ build สำหรับ production:
```bash
cd /data/hermes-agent-template/virtual-office
npm run build
# ไฟล์จะอยู่ที่ .next/ โดย server.py จะ serve ให้อัตโนมัติ
```

---

## ✅ Checklist ก่อนเริ่มต้น (Pre-flight Check)

- [ ] ติดตั้ง Node.js และ npm
- [ ] ติดตั้ง Python dependencies (`pip install -r requirements.txt`)
- [ ] ตรวจสอบว่า `config.yaml` มี personalities อยู่แล้ว
- [ ] เตรียมพื้นที่วาด Pixel Art หรือโหลดจาก OpenGameArt
- [ ] ศึกษา Phaser.js documentation เบื้องต้น
- [ ] ติดตั้ง Tiled Map Editor (ถ้าจะทำ Phase 5)

---

**สร้างเมื่อ:** 30 เมษายน 2026  
**ผู้จัดทำ:** ลูฟี่ (Luffy) - Senior Full Stack Developer  
**สำหรับ:** พี่กิต (P'Kit) - Virtual Office Project

> 💡 **Tip:** เริ่มจาก Phase 1 ให้เสร็จก่อน อย่าเพิ่งกระโดดไปทำ Multiplayer เด็ดขาด! จงก้าวทีละก้าวครับพี่กิต 💪
