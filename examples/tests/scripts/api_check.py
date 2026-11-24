import apiritif


class TestHealth(apiritif.APITestCase):
    def test_health(self):
        response = self.target("https://example.com").get("/")
        response.assert_ok()
