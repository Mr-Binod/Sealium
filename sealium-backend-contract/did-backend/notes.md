



private key 생성

- 사용자의 정보 가지고 solidityPacked 사용하여 개인키 생생

```js
export const CreatePvtKey = (data : CreateDidDto) => {
    const idKey = `${data.id}:${data.domain}`;  
    const value = solidityPacked(['string', 'string'], [data.salt, idKey ]);
    const pvtkey = keccak256(value).replace('0x', '').slice(0, 64);
    return `0x${pvtkey}`;
}
```

- 그 개인키 가지고 지갑 생생 및 DID 생성 
- etherDID 라이브러리 사용해서 DID 생성 및 검증 기능 구현

