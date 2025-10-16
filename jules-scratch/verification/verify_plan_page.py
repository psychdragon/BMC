from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000/plan?load=test-project-plan.json")
        page.wait_for_selector('.plan-phase')
        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

run()
