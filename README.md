

# Sealium
<h2><a href="https://admin.sealiumback.store" style="color: lightblue;">Sealium 사이트 이동</a></h2>

# 목차
- [프로젝트 소개](#프로젝트-소개)
- [개인 프로젝트](#팀원-소개)
- [화면 구성](#화면-구성)
- [주요 기능](#주요-기능)
- [개발 기간](#개발-기간)
- [기술 스택](#기술-스택)
- [협업 도구](#협업-도구-communication)
- [회고 로그](#회고-로그)

-------

## 개발 기간
- 1 달

-----

## 프로젝트 소개

- 블록체인 네트워크를 사용하여 DID 기반 VC(수료증) 발급 및 검증할수 있는 플랫품 SEALIUM

----

## 팀원 소개 
<div style="display:flex">
<div>
    <img src="https://github.com/susuholee.png" width="80px"><br>
    <a href="https://github.com/susuholee">팀장 : 이수효 </a><br>
</div>
<div style="margin : 0 50px; "> 
    <div style=" font-size:18px; font-weight:bold;" >담당</div></br>
    <p style="font-size: 14px;">설계, 클라이언트 프론트, 배포, , 관리</p>
</div>
</br>
</div> <br/>
<div style="display:flex">
<div>
<img src="https://github.com/Mr-Binod.png" width="80px"><br>
<a href="https://github.com/Mr-Binod">팀원 : 비노드 </a><br>
</div> 
<div style="margin : 0 50px; "> 
    <div style=" font-size:18px; font-weight:bold;" >담당</div></br>
    <p style="font-size: 14px;">관리자 프론트, 검증 프론트, 백엔드, 블록체인, 배포</p>
</div>
</br>
</div> <br/>

---

## 화면 구성 
### desktop view
<label >관리자 페이지</label> </br> 
[▶ 관리자 페이지 영상](sealium-backend-contract/did-backend/uploads/adminsignup.mp4)
<br/><br/>
<label>클라이언트 페이지</label></br>
[▶ 클라이언트 페이지 영상](sealium-backend-contract/did-backend/uploads/clientsealium.mp4)
<br/><br/>
<label>검증 페이지</label></br>
[▶ 검증 페이지 영상](sealium-backend-contract/did-backend/uploads/verify.mp4)
<br/><br/>



## 주요 기능

- 관리자의 등급은 슈퍼관리자 와 일반관리자, 슈퍼 관리자는 하드 고딩으로 생성 일반 관리자는 회원가입하고 슈퍼관리자가 요청 수락한후 로그인 가능

- 관리자 요청 및 관리 권한는 슈펴 관리자만 가능

- 클라이언트쪽에서 수료증 요청시 수료증 목록에 확인하여 승은과 거절 저리 가능, 승인시 VC(수료증) 발급 및 블록체인에 기록 거절시 거절 처리

- 사용자의 목록 확인 가능, 사용자의 개인정보, 전체 사용자, 일일 가입 및 일일 방문 사용자 확인 가능

- 검색장에서 이름, 아이디로 사용자와 관리자 조회 가능

- 개인 정보 확인 및 수정 가능

- 회원 탈퇴도 가능합니다 (데이터베이스과 스마트 컨트랙트에서도 제거)

- 검증 페이지에서 공유 링크와 사용자의 DID 공개키를 가지고 검증가능 (검증시 사용자와 발급자의 개인키가지고 vc 검증 과정 진행 성공시 vc 발급 실패시 error)

## API 문서 

### 📥 GET 요청

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET  | /admin/admins        | 전체 관리자 조회 (find all)         |
| GET  | /admin/adminId       | 관리자 조회 (find one)              |
| GET  | /user/users          | 전체 유저 조회 (find all)           |
| GET  | /user/userId         | 유저 조회 (find one)                |
| GET  | /user/userId         | 유저의 전체 수료증 (find all)       |
| GET  | /pendingvc/:id       | 유저 대기중 수료증 조회 (find all)  |
| GET  | /admin/vcrequestlogs | 전체 수료증(VC) 요청 (find all)     |
| GET  | /admin/oauth         | 관리자 로그인 유효 확인             |
| GET  | /admin/logout        | 관리자 로그아웃                     |
| GET  | /user/logout         | 유저 일반 로그아웃                  |
| GET  | /user/oauth          | 유저 로그인 유효 확인               |

---


### ➕ POST 요청

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /user/login        | 유저 로그인        |
| POST | /user              | 유저 회원가입      |
| POST | /admin/request     | 관리자 가입 요청   |
| POST | /admin             | 관리자 가입        |
| POST | /verifyvc          | 수료증 검증        |
| POST | /user/vc/request   | 수료증 발급 요청   |
| POST | /user/vc/confirm   | 수료증 발급 승인   |

---

### 🛠 PATCH 요청

| 메서드 | 경로 | 설명 |
|--------|------|------|
| PATCH | /user/:userId       | 유저 정보 수정       |
| PATCH | /user/rejectrevoke  | 수료증 폐기 거절     |
| PATCH | /user/approverevoke | 수료증 발급 거절     |
| PATCH | /user/rejectissue   | 수료증 폐기 수락     |
| PATCH | /admin/:id          | 관리자 수정          |




---

### ❌ DELETE 요청

| 메서드 | 경로 | 설명 |
|--------|------|------|
| DELETE | /admin/:adminId | 관리자 탈퇴     |
| DELETE | /user/:userId   | 유저 탈퇴       |
| DELETE | /user/:userId/vc| 수료증 폐기 (VC) |



## 기술 스택 
### FRONTEND
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4433FF?style=for-the-badge&logo=zustand&logoColor=white)


### 🛠 BACKEND
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)


### CONTRACT
![Avalanche](https://img.shields.io/badge/Avalanche-E84142?style=for-the-badge&logo=avalanche&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)

### DATABASE
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-000000?style=for-the-badge&logo=drizzle&logoColor=white)


### 협업 도구 COMMUNICATION 
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

### API
![KakaoTalk](https://img.shields.io/badge/KakaoTalk-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=000000)

### Distribution
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)


### Library and test tools

#### FRONTEND
- tanstack /react-query
- zustand
- axios
- dotenv


#### BACKEND
- ethers
- ethr-did
- crypto
- elliptic
- jsonwebtoken
- cookie-parser
- cors
- axios
- multer

### Test & contract deployment
1. hardhat
2. Jest

#### AI
- cursor
- chatgpt
- gemini
- claude

# 회고 로그 
<!-- - 프로젝트 목표, 계획, 구현, 유지보수, 회고 -->
- 이번 프로젝트에서는 Avalanche 프라이빗 네트워크를 VirtualBox 환경에서 먼저 테스트한 뒤, 실제 서비스 환경인 AWS 인스턴스 위에서 다시 구축하여 안정적인 블록체인 네트워크를 구현했습니다.

- NestJS 아키텍처를 경험하면서, MVC 패턴의 부족했던 부분(타입 검사, 의존성 주입, 테스트)을 체계적으로 보완할 수 있음을 깨달았습니다. 이를 통해 단순히 동작하는 코드를 작성하는 것에서 나아가, 서비스를 구조적으로 관리하고 장기적으로 유지할 수 있는 방법을 배웠습니다.

- Drizzle ORM을 통해 Sequelize 대비 더 직관적이고 빠른 테이블 정의와 관계 설정이 가능함을 경험했습니다. ORM의 장점을 체감하면서, 데이터베이스 설계가 프로젝트의 핵심임을 다시금 느꼈습니다.

- CloudFront와 서브도메인 배포 과정을 통해 백엔드/프론트엔드 분리 배포보다 효율적인 인프라 구성을 배웠습니다. 이를 통해 프로젝트 확장성을 고려한 배포 전략을 익힐 수 있었습니다.

- 시간 제약으로 인해 실시간 채팅이나 UI 디자인 디테일 같은 기능 구현은 미흡했습니다. 그러나 단순히 부족했다고 끝내기보다, 이후에는 더욱 우선순위 선정을 명확히 하고 핵심 기능부터 완성도를 높이는 방향으로 개선해야 한다는 점을 배웠습니다.

- 팀원의 이탈로 인한 어려움도 있었지만, 남은 팀원들이 끝까지 협력하여 프로젝트를 성공적으로 완료했습니다. 이를 통해작업 분담의 중요성과 리스크 관리 필요성을 체감했습니다. 다음에는 초기 설계 단계에서 역할과 책임을 명확히 하고, 대체 가능한 플랜을 세워 리스크를 줄일 계획입니다.