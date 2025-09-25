
import asyncio
import os
import http.server
import socketserver
import threading
from playwright.async_api import async_playwright

# --- 설정 ---
PORT = 8000
URL = f"http://localhost:{PORT}/index.html"
OUTPUT_DIR = "PDF/slides"
VIEWPORT_WIDTH = 1920
VIEWPORT_HEIGHT = 1080
# --- 설정 끝 ---

def run_server():
    """백그라운드에서 간단한 HTTP 서버를 실행합니다."""
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

async def main():
    """Playwright를 사용하여 각 슬라이드를 PDF로 캡처합니다."""
    # 출력 디렉터리 생성
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"'{OUTPUT_DIR}' 디렉터리를 생성했습니다.")

    # 백그라운드에서 서버 시작
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            viewport={"width": VIEWPORT_WIDTH, "height": VIEWPORT_HEIGHT}
        )

        try:
            print(f"'{URL}' 페이지로 이동 중...")
            await page.goto(URL, wait_until="networkidle")
            print("페이지 로딩 완료.")

            # 전체 슬라이드 수 가져오기
            slide_count = await page.evaluate("() => document.querySelectorAll('.slide').length")
            if slide_count == 0:
                print("오류: 슬라이드를 찾을 수 없습니다. '.slide' 클래스를 확인하세요.")
                return

            print(f"총 {slide_count}개의 슬라이드를 발견했습니다.")

            for i in range(slide_count):
                slide_number = i + 1
                print(f"{slide_number}/{slide_count} 슬라이드 캡처 중...")

                # JavaScript를 실행하여 특정 슬라이드로 이동
                await page.evaluate(f"showSlide({i})")

                # 차트, 지도 등 동적 콘텐츠가 렌더링될 시간을 줍니다.
                await page.wait_for_timeout(2000)

                output_path = os.path.join(OUTPUT_DIR, f"slide_{slide_number:02d}.pdf")

                # PDF로 저장
                await page.pdf(
                    path=output_path,
                    width=f"{VIEWPORT_WIDTH}px",
                    height=f"{VIEWPORT_HEIGHT}px",
                    print_background=True,
                    scale=1,
                )
                print(f"'{output_path}'에 저장 완료.")

            print("\nPDF 생성이 완료되었습니다.")
            print(f"결과물은 '{os.path.abspath(OUTPUT_DIR)}' 폴더에서 확인할 수 있습니다.")

        except Exception as e:
            print(f"오류가 발생했습니다: {e}")
        finally:
            await browser.close()
            # 서버는 데몬 스레드이므로 스크립트 종료 시 자동으로 중지됩니다.


if __name__ == "__main__":
    asyncio.run(main())
