
// certificate.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CertificateService {
  constructor(private configService: ConfigService) {}
  async generateCertificate(VC: string): Promise<Uint8Array> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const decoded = jwt.verify(VC, this.configService.get<string>('JWT_SECRET_KEY') as string)
    console.log(decoded, 'decodedVcCertificate');

    const htmlContent = `
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');
    body {
      font-family: 'Noto Sans KR', sans-serif;
      margin: 40px;
      padding: 0;
      border: 12px double #b8860b; /* gold double border */
      position: relative;
      height: 1020px;
      box-sizing: border-box;
    }
    .header {
      text-align: right;
      font-size: 14px;
      margin-bottom: 20px;
      letter-spacing: 2px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
   
    h1 {
      text-align: center;
      font-size: 48px;
      font-weight: bold;
      margin: 0 0 40px 0;
      letter-spacing: 12px;
    }
    ul.details {
      list-style-type: disc;
      margin: 0 0 40px 40px;
      font-size: 18px;
      line-height: 1.6;
    }
    ul.details li {
      margin-bottom: 12px;
    }
    .main-text {
      font-size: 22px;
      text-align: center;
      margin-bottom: 160px;
      line-height: 1.5;
    }
    .certificateDetails {
    width: 80%;
    margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .issuer {
      display: flex;
      flex-direction: column;
      text-align: center;
      font-weight: 500;
      padding: 0px;
      margin: 0;
    }
    

  </style>
</head>
<body>
  <div class="header">제 2023-S1-000002 호</div>
  <div class="logo">
    <img src="https://aodr.org/xml//15457/ADR_2018_v31n3_133_t012-2.jpg" alt="Korean government logo" style="width: 150px;" />
  </div>
  <h1>수료증</h1>
  <ul class="details">
    <li>소속 : org </li>
    <li>직위 : position</li>
    <li>성명 : ${name}</li>
    <li>과정 : course</li>
    <li>교육기간 : period</li>
    <li>교육구분 : category</li>
  </ul>
  <div class="main-text" style="width: 80%; margin: 30px auto;">
    위 사람은 issuer에서 소정의 교육과정을 이수하였으므로 이 증을 수여합니다.
  </div> 
  <div class="certificateDetails">
    <div class="date">
      <div>issueDate</div></br>
      <div>expireDate</div> 
    </div>
    <div class="issuer">
    <div class="seal" style="width: 150px; height: 150px; overflow: hidden; "><img src="https://d2v80xjmx68n4w.cloudfront.net/gigs/rate/tyo8G1682679670.png" alt="Seal" style="width: 150px; "/></div>
    <div>발급기관</div>
    </div>
  </div>
</body>
</html>
`;


    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return pdfBuffer;
  }
}
