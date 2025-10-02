/******************************************************
 * DID & VC 데모 (블록체인 미사용 / 메모리만 사용)
 * - 목표: DID 문서 생성 → VC 발급(JWT/JWS 서명) → VC 검증
 * - 핵심 포인트:
 *   1) 공개키는 65바이트 비압축(0x04 포함) 형태로 DID 문서에 넣는다
 *   2) JWK(EC, secp256k1) 형식(publicKeyJwk)도 함께 넣어 라이브러리 호환성을 높인다
 *   3) JWT 헤더의 kid == DID 문서의 verificationMethod.id 와 정확히 일치시킨다
 *   4) verificationMethod를 authentication, assertionMethod 용도로 모두 노출한다
 ******************************************************/

// secp256k1: ECDSA 키 쌍(secp256k1 곡선) 생성/검증을 위한 라이브러리
const secp256k1 = require('secp256k1');

// crypto.randomBytes: 안전한 난수(개인키 생성용)
const { randomBytes } = require('crypto');

// did-jwt: DID 기반 JWT/JWS 생성/검증 유틸 (VC 발급/검증에 사용)
const { createJWT, verifyJWT, SimpleSigner } = require('did-jwt');

/* ---------------------------------------------------
   유틸 1) base64url 인코더
   - JWK의 x, y 좌표는 base64url로 표현해야 함
   - '=' 패딩 제거, '+' → '-', '/' → '_' 치환이 base64url 규칙
--------------------------------------------------- */
function toBase64Url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/=/g, '')   // 패딩 제거
    .replace(/\+/g, '-') // '+' → '-'
    .replace(/\//g, '_') // '/' → '_'
}

/* ---------------------------------------------------
   유틸 2) secp256k1 키쌍 생성
   - 개인키: 32바이트 랜덤
   - 공개키: 비압축(언컴프레스드) 65바이트 형태(선두 0x04 + X 32B + Y 32B)
   - "검증 라이브러리 호환"을 위해 비압축 65바이트 형태를 사용
--------------------------------------------------- */
function genSecp256k1Keypair() {
  let priv;
  do {
    priv = randomBytes(32);                  // 후보 개인키 32바이트 생성
  } while (!secp256k1.privateKeyVerify(priv)); // secp256k1 표준에 부합하는지 확인

  const pub65 = secp256k1.publicKeyCreate(priv, false); // false = 비압축(65바이트)
  return { privateKey: priv, publicKey65: pub65 };      // 개인키, 공개키(65B) 반환
}

/* ---------------------------------------------------
   유틸 3) DID 문자열 생성
   - 이번 데모에선 did:example 스킴 사용
   - 실제 서비스에선 did:ethr, did:web, did:key 등을 사용
   - 공개키는 반드시 'hex'로 문자열화해야 함 (쉼표나 이상한 포맷 금지)
--------------------------------------------------- */
function toDID(publicKey65) {
  const hex = Buffer.from(publicKey65).toString('hex'); // 65바이트 전체를 hex로 변환
  return { did: `did:example:${hex}`, publicKeyHex65: hex }; // did:example:<hex...> 형태로 생성
}

/* ---------------------------------------------------
   유틸 4) 공개키(65바이트) → JWK(EC,secp256k1) 변환
   - JWK는 kty, crv, x, y 필드를 가진 표준 공개키 포맷
   - x, y는 32바이트 씩이며 base64url 로 인코딩해야 한다
--------------------------------------------------- */
function pub65ToJwk(pub65) {
  // pub65[0] == 0x04 (비압축 포맷 표시)
  const x = pub65.slice(1, 33);  // 1~32 바이트: X 좌표
  const y = pub65.slice(33, 65); // 33~64 바이트: Y 좌표
  return {
    kty: 'EC',                   // Key Type: Elliptic Curve
    crv: 'secp256k1',            // Curve: secp256k1
    x: toBase64Url(x),           // X 좌표(base64url)
    y: toBase64Url(y),           // Y 좌표(base64url)
  };
}

/* ---------------------------------------------------
   유틸 5) DID 문서(DID Document) 생성
   - verificationMethod: 검증자가 공개키를 얻는 방법/위치 정의
     - id: "<DID>#keys-1" 형태 (JWT 헤더의 kid와 반드시 동일해야 함)
     - type: 키 타입 명시 (EcdsaSecp256k1VerificationKey2019 등)
     - controller: 이 키를 제어하는 DID (대개 자기 자신)
     - publicKeyHex: 공개키의 hex 표현 (여기서는 비압축 65바이트 전체)
     - publicKeyJwk: JWK 표준 포맷 (라이브러리 호환성 ↑)
   - authentication: 로그인/인증에 쓸 키 (여기선 동일 키 참조)
   - assertionMethod: 증명/서명(VC 발급/검증) 목적 키 (여기선 동일 키 참조)
--------------------------------------------------- */
function makeDidDocument(did, publicKey65) {
  const publicKeyHex = Buffer.from(publicKey65).toString('hex'); // 65바이트 전체 hex
  const publicKeyJwk = pub65ToJwk(publicKey65);                  // JWK로도 준비
  const vmId = `${did}#keys-1`;                                  // verificationMethod id

  return {
    '@context': 'https://www.w3.org/ns/did/v1', // DID 표준 컨텍스트(JSON-LD)
    id: did,                                    // 이 문서가 설명하는 DID
    controller: did,                             // 문서 제어 주체 (보통 자기 자신)
    verificationMethod: [                        // 공개키(검증 수단) 배열
      {
        id: vmId,                                // 키 식별자(앵커) → JWT kid와 동일해야 함
        type: 'EcdsaSecp256k1VerificationKey2019', // 키 유형(표준명)
        controller: did,                         // 이 키를 제어하는 DID
        publicKeyHex,                            // 65바이트 비압축 공개키 hex
        publicKeyJwk,                            // JWK 포맷(EC, secp256k1, x, y)
      }
    ],
    authentication: [vmId],                      // 인증 목적 키
    assertionMethod: [vmId],                     // 증명/서명 목적 키(VC에서 주로 사용)
    // service: []                               // 필요시 서비스 엔드포인트 추가 가능
  };
}

/* ---------------------------------------------------
   1) 발급자(issuer), 소유자(holder) DID 및 DID 문서 생성
   - 블록체인 저장은 하지 않고, 메모리에만 보관
   - 검증자는 '리졸버'를 통해 메모리에서 DID 문서 조회
--------------------------------------------------- */
const issuer = genSecp256k1Keypair();                                      // 발급자 키쌍
const holder = genSecp256k1Keypair();                                      // 소유자 키쌍

const { did: ISSUER_DID } = toDID(issuer.publicKey65);
const { did: HOLDER_DID } = toDID(holder.publicKey65);

const ISSUER_DOC = makeDidDocument(ISSUER_DID, issuer.publicKey65);        // 발급자 DID 문서
const HOLDER_DOC = makeDidDocument(HOLDER_DID, holder.publicKey65);        // 소유자 DID 문서(참고용)

console.log('== 생성된 DID들 ==');
console.log('ISSUER DID :', ISSUER_DID);                                   // 예: did:example:<hex...>
console.log('HOLDER DID :', HOLDER_DID);

/* ---------------------------------------------------
   2) in-memory DID Resolver (W3C DID Resolution 응답 포맷)
   - verifyJWT는 resolver.resolve(did) 호출로 DID 문서를 가져온다
   - 표준 포맷: { didDocument, didResolutionMetadata, didDocumentMetadata }
--------------------------------------------------- */
const inMemoryDidDocs = {
  [ISSUER_DID]: ISSUER_DOC, // 발급자 DID → 문서
  [HOLDER_DID]: HOLDER_DOC, // 소유자 DID → 문서(이번 검증엔 직접 사용 X)
};

const resolver = {
  // verifyJWT가 기대하는 인터페이스: resolve(did)
  async resolve(did) {
    // 메모리에서 문서 조회 (실서비스라면 블록체인/웹/데이터베이스)
    const didDocument = inMemoryDidDocs[did];
    if (!didDocument) {
      // 표준대로라면 에러 코드를 didResolutionMetadata에 담기도 하지만
      // 여기선 단순화를 위해 throw
      throw new Error(`DID Document not found for ${did}`);
    }
    return {
      didDocument,                                    // 실제 DID 문서(JSON-LD)
      didResolutionMetadata: {                        // DID 해석(리졸브) 과정 메타데이터
        contentType: 'application/did+ld+json',       // 문서 타입(정보성)
        retrievedFrom: 'in-memory',                   // 어디서 가져왔는지(디버깅)
        error: null                                   // 에러 없음을 명시
      },
      didDocumentMetadata: {                          // DID 문서 자체의 메타데이터(상태)
        created: new Date().toISOString(),            // 생성 시각(예시)
        updated: new Date().toISOString(),            // 갱신 시각(예시)
        deactivated: false                            // 비활성화 여부(예시)
      }
    };
  }
};

/* ---------------------------------------------------
   3) VC 발급 (Issuer → Holder)
   - payload 내부 중요한 값들:
     - sub: 이 VC가 "누구(어떤 DID)"에 대한 것인지 (소유자 DID)
     - vc: VC 표준 컨텍스트/타입/내용(credentialSubject)
       * credentialSubject.id: 대상 DID를 명시적으로 넣어주면 해석하기 쉬움
       * degree: 실제 증명하려는 속성들(예: 학위 정보)
   - header(헤더) 중요 값:
     - alg: 'ES256K' (secp256k1 + SHA-256)
     - kid: "<ISSUER_DID>#keys-1" (verificationMethod.id와 정확히 일치)
--------------------------------------------------- */
async function issueVC() {
  // 발급자의 개인키를 did-jwt 서명자(SimpleSigner)에 전달 (hex 문자열)
  const signer = SimpleSigner(issuer.privateKey.toString('hex'));

  // JWT 페이로드(VC 내용)
  const payload = {
    sub: HOLDER_DID,                                 // VC의 대상(소유자 DID)
    nbf: Math.floor(Date.now() / 1000),              // not-before: 이 시간 이전엔 무효
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'], // VC 표준 컨텍스트
      type: ['VerifiableCredential', 'UniversityDegreeCredential'], // VC 유형
      credentialSubject: {                            // 실제 증명할 속성들
        id: HOLDER_DID,                               // 명시적으로 대상 DID 기입 권장
        degree: {                                     // 예시: 학위 정보
          type: 'BachelorDegree',
          name: 'Bachelor of Science and Arts'
        }
      }
    }
  };

  // JWT 헤더: kid를 명시 → 검증 시 정확히 해당 키(verificationMethod.id)로 찾게 함
  const header = {
    alg: 'ES256K',                  // ECDSA(secp256k1) + SHA-256
    kid: `${ISSUER_DID}#keys-1`     // DID 문서의 verificationMethod.id 와 완벽히 동일해야 함
  };

  // JWT(JWS) 생성(= 서명)
  const jwt = await createJWT(payload, { issuer: ISSUER_DID, signer }, header);

  // 발급된 VC(JWT) 출력
  console.log('\n== 발급된 VC (JWT) ==\n', jwt, '\n');
  return jwt;
}

/* ---------------------------------------------------
   4) VC 검증 (Verifier)
   - verifyJWT(jwt, { resolver }) 호출 시 내부 동작:
     1) JWT 헤더의 kid/iss에서 발급자 DID 파악
     2) resolver.resolve(발급자 DID) → DID 문서 획득
     3) DID 문서의 verificationMethod에서 kid에 해당하는 공개키를 찾음
     4) 공개키로 JWT 서명 검증
   - 검증 성공 시 result.payload에 credentialSubject 등 신뢰 가능
--------------------------------------------------- */
async function verifyVC(jwt) {
  const result = await verifyJWT(jwt, { resolver });

  // 검증 성공: 발급자/타입/대상/증명내용 출력
  console.log('== 검증 결과 ==');
  console.log('- 발급자 DID          :', result.issuer);
  console.log('- VC 타입             :', result.payload?.vc?.type);
  console.log('- 대상(소유자) DID     :', result.payload?.sub);
  console.log('- credentialSubject   :', result.payload?.vc?.credentialSubject);
  console.log('\n검증 성공 ✅ (서명 유효)\n');
}

/* ---------------------------------------------------
   5) 시나리오 실행
   - 1) VC 발급
   - 2) VC 검증(성공)
   - 3) 공격 테스트: 발급자 공개키 바꿔치기 → 검증 실패
   - 4) 원복 후 다시 검증(성공)
--------------------------------------------------- */
(async () => {
  try {
    // 1) VC 발급
    const jwt = await issueVC();

    // 2) 정상 검증(성공해야 정상)
    await verifyVC(jwt);

    // 3) 공격 테스트: 발급자 DID 문서의 공개키를 가짜로 교체 → 검증 실패 기대
    console.log('== 공격 테스트: 발급자 공개키 바꿔치기 → 검증 실패 기대 ==');
    const fake = genSecp256k1Keypair();                                  // 가짜 키
    inMemoryDidDocs[ISSUER_DID] = makeDidDocument(ISSUER_DID, fake.publicKey65); // 문서 대체
    try {
      await verifyVC(jwt); // 여기서 실패해야 정상
      console.log('⚠️ 예상과 달리 성공했습니다. 구현을 점검하세요.');
    } catch {
      console.log('의도대로 검증 실패 ✅ (문서 공개키가 발급 시점과 달라짐)');
    }

    // 4) 원래 발급자 DID 문서로 복구 후 다시 검증(성공)
    inMemoryDidDocs[ISSUER_DID] = ISSUER_DOC; // 원복
    await verifyVC(jwt);

  } catch (e) {
    // 전체 흐름에서 발생한 예외 출력
    console.error('오류 발생:', e);
  }
})();


// 코드에서 만든 “값”들이 왜 중요한가?
// ISSUER_DID / HOLDER_DID
// 발급자/소유자 누가 누구인지 식별하는 이름표.

// ISSUER_DOC.verificationMethod[0].publicKeyHex
// 발급자의 공개키. 검증자가 proof(서명) 를 확인할 때 쓰는 기준.

// payload.sub / payload.vc.credentialSubject
// 누구(어떤 DID)에게 어떤 사실을 증명하는지 담는 VC 본문.

// createJWT(..., { issuer: ISSUER_DID, signer }, { alg: 'ES256K' })
// 발급자가 자기 DID로 서명했다는 표식(alg는 서명 알고리즘).

// verifyJWT(jwt, { resolver })
// 검증자가 iss(발급자 DID)를 보고 resolver로 DID 문서(publicKeyHex) 를 받아와
// 서명 진짜인지 확인.

// 이해 포인트 요약
// DID 문서는 “내가 쓰는 공개키는 이거야”를 표준 형태로 공개한 데이터.

// VC는 “이 DID(사람/주체)에 대해 이런 사실(속성) 이 진짜야”라는 서명된 증명서.

// 검증은 발급자 DID 문서의 공개키로 VC 서명을 확인하는 과정.
