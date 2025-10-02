import Image from "next/image";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Certificate = ({ 
  userName, 
  userId, 
  certificateName, 
  issuerId, 
  description, 
  issueDate, 
  request, 
  status 
}) => {


  const certificateRef = useRef();

  // PDF 다운로드 핸들러 함수
  const handleDownloadPdf = async () => {
    const element = certificateRef.current;
    
    // HTML 요소를 캔버스로 변환
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    // jspdf 인스턴스 생성
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // PDF에 이미지 추가
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // 파일 이름 지정 및 PDF 저장
    pdf.save(`수료증_${userName || '홍길동'}_${certificateName || '과정'}.pdf`);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black p-8">
      {/* Navigation */}
      {/* <nav className="flex justify-end mb-8">
        <div className="flex gap-6 text-white text-sm">
          <a href="#" className="hover:text-blue-400 transition-colors">home</a>
          <a href="#" className="hover:text-blue-400 transition-colors">about</a>
          <a href="#" className="hover:text-blue-400 transition-colors">services</a>
          <a href="#" className="hover:text-blue-400 transition-colors">contact</a>
        </div>
      </nav> */}

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-200 tracking-wider">
          CERTIFICATE OF COMPLETION
        </h1>
      </div>
      <button onClick={handleDownloadPdf}>수료증 다운로드 (PDF)</button>
      {/* Certificate Container */}

      <div className="max-w-5xl mx-auto " ref={cer}>
        <div className="bg-black/50 border-2 border-blue-500 rounded-lg p-10 px-16 backdrop-blur-sm shadow-2xl shadow-blue-500/20 min-h-[550px]">
          {/* Certificate Header */}
          <h1 className="text-4xl  text-blue-100 font-semibold mb-6 w-fit mx-auto">수 료 증</h1>
          
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl text-blue-100 font-semibold ">
              경일 게임IT 아카데미
            </h2>
            <Image src="/jungbu.png" alt="jungbu" width={80} height={80} />
             <div className="w-[211px] flex justify-end">제: 2025-123123 호</div>
            {/* <div className="text-blue-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div> */}
          </div>

          {/* Certificate Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            {/* Left Column - Profile */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-40 h-40 rounded-full border-4 border-blue-500 mb-8 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">이름 : {userName || '홍길동'}</h3>
              <h4 className="text-xl text-blue-100 font-semibold ">{userName || '1995-05-07'}</h4>
            </div>

            {/* Middle Column - Details */}
            <div className="lg:col-span-2 space-y-4 ">
              <div className="gap-2 border-b-1 border-blue-700 pb-4 space-y-2">
                <div>
                  <label className="text-blue-400 text-md font-bold">사용자 DID</label>
                  <p className="text-white font-mono">{userId || '000000000008980'}</p>
                </div>
                <div>
                  <label className="text-blue-400 text-md font-bold">수료증 이름</label>
                  <p className="text-white">{certificateName || 'Advanced Component Certification'}</p>
                </div>
                <div>
                  <label className="text-blue-400 text-md font-bold">발급자 DID</label>
                  <p className="text-white font-mono">{issuerId || 'I REPULSOR. STITKDRUMM I'}</p>
                </div>
                <div>
                  <label className="text-blue-400 text-md font-bold">발급 날짜 </label>
                  <p className="text-white">{issueDate || '04/03/2024'}</p>
                </div>
              </div>

              {/* Status Section */}
              {/* <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-400 font-semibold text-lg">
                  {status || 'LOCATING MISSING COMPONENT'}
                </p>
              </div> */}

              {/* Request Section */}
              {/* <div className="mt-4">
                <label className="text-blue-400 text-sm font-medium">Request</label>
                <p className="text-white mt-1">{request || 'Component verification and validation'}</p>
              </div> */}

              {/* Korean Text Section */}
              <div className="mt-6 space-y-2 text-md">
                
                <div className="flex justify-between">
                  <span className="text-blue-300 font-bold">교육 기간:</span>
                  <span className="text-white">{userId || '6개월'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">검증 결과:</span>
                  <span className="text-green-400 font-bold">검증 완료</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            {/* <label className="text-blue-400 text-sm font-medium mb-2 block text-md font-bold">Description (내용)</label> */}
            <p className="text-white leading-relaxed text-xl">
              {description || `본 수료증은 귀하깨서 ${certificateName || "관련 프로그램 "} 과정을 정상적으로 수료하였음을 증명합니다. 위 사람은 요구된 모든 기준을 충족하여 해당 교육 과정을 마쳤으므로 이 증서를 수여합니다. `}
            </p>
          </div>
          <div className="mt-8 pr-15 h-15 flex justify-end items-center">
            <Image src="/stamp.png" alt="certificate" width={80} height={0} />
          </div>
          {/* Metrics Section */}
          {/* <div className="mt-12 flex justify-center gap-12">
            {[12.37, 16.3, 1.77].map((value, index) => (
              <div key={index} className="w-28 h-28 rounded-full border-3 border-blue-500 flex items-center justify-center bg-blue-900/20">
                <span className="text-blue-400 font-bold text-2xl">{value}</span>
              </div>
            ))}
          </div> */}

          {/* Footer */}
          {/* <div className="mt-8 flex justify-between items-center pt-6 border-t border-blue-500/30">
            <div className="text-white font-semibold">SIGNATURE</div>
            <div className="text-right">
              <div className="text-white font-semibold">DATE</div>
              <div className="text-blue-400">{issueDate || '04/03/2024'}</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
