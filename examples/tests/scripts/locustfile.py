from locust import HttpUser, between, task


class Shopper(HttpUser):
    wait_time = between(1, 2)

    @task
    def home(self):
        self.client.get("/")
