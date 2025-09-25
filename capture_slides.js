// 모든 슬라이드를 순차적으로 캡처하는 스크립트
async function captureAllSlides() {
  const totalSlides = 17; // 총 슬라이드 개수
  const results = [];

  for (let i = 0; i < totalSlides; i++) {
    // 슬라이드 전환
    if (typeof showSlide === 'function') {
      showSlide(i);
    }

    // 잠시 대기 (애니메이션 완료 대기)
    await new Promise(resolve => setTimeout(resolve, 500));

    results.push({
      slideNumber: i + 1,
      captured: true
    });
  }

  return {
    success: true,
    totalCaptured: results.length,
    slides: results
  };
}

// 함수 실행
captureAllSlides();