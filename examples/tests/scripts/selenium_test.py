import unittest

from selenium import webdriver


class TestHome(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Remote()

    def test_title(self):
        self.driver.get("https://example.com")
        self.assertIn("Example", self.driver.title)

    def tearDown(self):
        self.driver.quit()
